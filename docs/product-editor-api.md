# Product editor — backend contract

The product editor (`/products/new`, `/products/:id/edit`) follows the new design.
It works with the API as it is today, but some parts need backend support before
they are saved or shown correctly. This file lists what the frontend already
sends and reads.

Status legend: **exists** — already used by the app · **new** — the frontend
is ready, the backend must add it.

## 1. Categories — 3-level tree (exists / new)

Levels: `0` Departament › `1` Kategoriya › `2` Subkategoriya. **Products are
attached only to level 2** — the editor's category picker lets you open levels
0–1 but only a subcategory becomes `categoryId`.

- `GET /categories/tree` (**new** — not live yet) — departments with nested
  `children`, each with `code`, `categoryLevel`, `childCount`, `hasChildren`.
  Until it exists (today `/categories/tree` falls into `/categories/{id}` and
  answers 400) the app falls back to `GET /categories`, which returns every
  category with `parentId` and `categoryLevel`, and builds the tree from it.
- `GET /categories/{id}` (**exists**) — edit form; returns `attributeTemplateId`.
- Template badges on the Bo'limlar tree (own = filled, inherited = faded) are
  computed from `attributeTemplateId` along the parents. `/categories/tree`
  doesn't send it, so the page merges it from `GET /categories`.
- `POST /categories` → id, `PUT /categories/{id}`, `DELETE /categories/{id}` (soft) (**exist**).
  On `PUT`, `parentId` / `attributeTemplateId`: `null` = keep, `0` = remove, `> 0` = set.
  The admin sends `null` for values the user didn't change, so an inherited
  template is never unlinked by accident.

Optional, still **new**: `commissionPercent` / `commissionTier` per category for
the profit preview (otherwise 12 %, `DEFAULT_COMMISSION_PERCENT`).

## 2. Attribute templates (exists)

- `GET /categories/{categoryId}/attributes` — the category's resolved template
  (`templateId`, `templateName`, `templateSourceCategoryId`, `attributes[]` with
  `required`, `sortOrder`, `options`). The product editor uses its
  `variant: true` attributes as variant axes; `required` axes must get at least
  one option. No template → the product is saved without variants.
- `GET|POST /attribute-templates`, `PUT|DELETE /attribute-templates/{id}` —
  Shablonlar page. `PUT` replaces `items` completely; `sortOrder` is the row
  order. `DELETE` answers 400 while a category uses the template.
- `GET /attribute-definition`, `GET /attribute-options/{id}` and the admin
  option endpoints — Atributlar page (unchanged).

Spec attributes (`variant: false`, e.g. Brend, Material) are section 02 of the
editor, drawn by `attributeType` (SELECT → one, MULTISELECT → many, TEXT,
NUMBER, BOOLEAN), `required` enforced. Saved after the variants with
`PUT /seller/products/specs/{productId}` (list replaces the saved one):

```json
{ "values": [
  { "attributeDefinitionId": 7, "optionIds": [21] },
  { "attributeDefinitionId": 9, "textValue": "100% paxta" }
] }
```

Edit mode prefills them from `specGroups` of `GET /product-attributes/{id}`
(`options` ids or `textValue`).

## 3. Create / update product (new fields in the body)

`POST /products` and `PUT /products/{id}` (**exists**) — both respond with the
product id (`int64`). The body (`ProductRequest`) keeps every current field and
the frontend also sends these, which the current `ProductRequest` doesn't have:

| Field           | Type                 | Notes                                                       |
| --------------- | -------------------- | ----------------------------------------------------------- |
| `imageUrls`     | `string[]`           | All images, first is main. `imageUrl` = `imageUrls[0]`.     |
| `purchasePrice` | `number`             | Purchase price ("Xarid narxi"). Must never reach customers. |
| `onlineEnabled` | `boolean`            | Sold in the ZARO app.                                        |
| `storeEnabled`  | `boolean`            | Sold in "Do'kondan sotish".                                  |
| `status`        | `"DRAFT" \| "PENDING_REVIEW" \| "ACTIVE"` | Draft button → `DRAFT`, submit → `PENDING_REVIEW`. |

Also derived by the frontend:

- `isActive` = `status !== "DRAFT" && onlineEnabled`.
- `discountPrice` = 0 when the "Chegirma" switch is off.
- `stockQuantity` = sum of variant stocks when variants exist.
- `nameUz` / `descriptionUz` fall back to `name` / `description` when left empty.
- `sortOrder` = next free number in the category (from `GET /products/category/{id}`).

`GET /products/{id}` should return the same new fields so the edit page can
prefill them. Variants are read from `GET /product-attributes/{productId}` (**exists**).

## 4. Variants (exists)

After the product is saved, generated variants go to
`PUT /seller/products/variants/{productId}`:

```json
{
  "variants": [
    { "variantId": 7, "selectedOptions": { "16": 52, "17": 60 }, "sku": null, "priceOverride": 170000, "stockQuantity": 10 }
  ]
}
```

`sku: null` (SKU left empty) → the backend generates it. `priceOverride` is
omitted when the variant uses the product price. Existing rows keep their
`variantId`; removed rows are simply not sent (the backend deactivates them).
When an edited product had variants and now has none, an empty list is sent.
If the product saves but the variants or specs call fails, the editor shows the
backend's reason and opens the saved product's edit page (no duplicate on retry).

## 4.1 Product list

`minPrice`, `maxPrice`, `hasVariants`, `inStock` from the product responses:
variant products with different prices show "<minPrice> dan"; `inStock: false`
shows a red "Tugagan" badge instead of the stock count.

## 5. Images (exists)

`POST /files/upload-multiple` — multipart field `file` (repeated), optional
`minWidth` / `minHeight` query params, responds with `ResourceFileDto[]`
(`{ fileId, url }`).

## 6. Recommendations already used (exists)

- `GET /products/search?q=` — name autocomplete, duplicate warning, "Nusxalash"
  (copy from a similar product), category and price recommendations.
- `GET /products/category/{id}` — price range of the category, next sort order.
