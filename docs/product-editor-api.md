# Product editor — backend contract

The product editor (`/products/new`, `/products/:id/edit`) follows the new design.
It works with the API as it is today, but some parts need backend support before
they are saved or shown correctly. This file lists what the frontend already
sends and reads.

Status legend: **exists** — already used by the app · **new** — the frontend
is ready, the backend must add it.

## 1. Categories — hierarchy and commission (new fields)

`GET /categories` — `CategoryResponse` has none of these yet; each item would get three optional fields:

| Field               | Type             | Meaning                                                  |
| ------------------- | ---------------- | -------------------------------------------------------- |
| `parentId`          | `number \| null` | Parent category. `null` = top level ("Bo'lim").           |
| `commissionPercent` | `number \| null` | ZARO commission for this category (inherited downwards). |
| `commissionTier`    | `string`         | Tier label shown in the UI, e.g. `"T3"`.                 |

Without `parentId` every category is shown as one flat level. Without
`commissionPercent` the profit preview uses 12 % (`DEFAULT_COMMISSION_PERCENT`
in `src/modules/products/constants.ts`).

## 2. Attributes (exists) and per-category attribute set (new)

Used now — checked against Swagger (`/v3/api-docs`):

- `GET /attribute-definition` — all definitions (`variant`, `attributeType`, `displayType`).
- `GET /attribute-options/{attributeDefinitionId}` — options of one definition.
- `POST /attribute-definition`, `PUT|DELETE /attribute-definition/{id}`,
  `POST /attribute-options/{attributeDefinitionId}`, `PUT|DELETE /admin/attribute-options/{id}`
  — used by the Attributes admin page (same `attributes` module).

`variant: false` definitions fill section 02, `variant: true` ones become the
variant axes in section 03. For `TEXT` attributes the options are autocomplete
suggestions; for `SWATCH` options `metaJson.colorHex` is the chip colour.

Not in the API yet: a per-category attribute set with a `required` flag, e.g.
`GET /categories/{categoryId}/attributes` returning definitions + `required` +
`options`. Until then every definition is shown for every category and none is
required.

## 3. Create / update product (new fields in the body)

`POST /products` and `PUT /products/{id}` (**exists**) — both respond with the
product id (`int64`). The body (`ProductRequest`) keeps every current field and
the frontend also sends these, which the current `ProductRequest` doesn't have:

| Field           | Type                 | Notes                                                       |
| --------------- | -------------------- | ----------------------------------------------------------- |
| `imageUrls`     | `string[]`           | All images, first is main. `imageUrl` = `imageUrls[0]`.     |
| `purchasePrice` | `number`             | Purchase price ("Xarid narxi"). Must never reach customers. |
| `storePrice`    | `number \| null`     | In-store price ("Do'kon narxi"), no commission.             |
| `onlineEnabled` | `boolean`            | Sold in the ZARO app.                                        |
| `storeEnabled`  | `boolean`            | Sold in "Do'kondan sotish".                                  |
| `status`        | `"DRAFT" \| "PENDING_REVIEW" \| "ACTIVE"` | Draft button → `DRAFT`, submit → `PENDING_REVIEW`. |
| `attributes`    | `AttributeValue[]`   | Section 02 answers, see below.                               |

```ts
interface AttributeValue {
  attributeDefinitionId: number;
  optionIds: number[]; // SELECT / MULTISELECT
  value: string | null; // TEXT / NUMBER / BOOLEAN ("true" | "false")
}
```

Also derived by the frontend:

- `isActive` = `status !== "DRAFT" && onlineEnabled`.
- `discountPrice` = 0 when the "Chegirma" switch is off.
- `stockQuantity` = sum of variant stocks when variants exist.
- `nameUz` / `descriptionUz` fall back to `name` / `description` when left empty.
- `sortOrder` = next free number in the category (from `GET /products/category/{id}`).

`GET /products/{id}` should return the same new fields so the edit page can
prefill them. Section 02 answers are read from `specGroups` of
`GET /product-attributes/{productId}` (**exists**).

## 4. Variants (exists)

After the product is saved, generated variants go to
`PUT /seller/products/variants/{productId}`:

```json
{
  "variants": [
    { "variantId": 7, "selectedOptions": { "16": 52, "17": 60 }, "sku": "AYO-YOZ-KOY-M-QIZI", "priceOverride": 170000, "stockQuantity": 10 }
  ]
}
```

`priceOverride` is omitted when the variant uses the product price.

## 5. Images (exists)

`POST /files/upload-multiple` — multipart field `file` (repeated), optional
`minWidth` / `minHeight` query params, responds with `ResourceFileDto[]`
(`{ fileId, url }`).

## 6. Recommendations already used (exists)

- `GET /products/search?q=` — name autocomplete, duplicate warning, "Nusxalash"
  (copy from a similar product), category and price recommendations.
- `GET /products/category/{id}` — price range of the category, next sort order.
