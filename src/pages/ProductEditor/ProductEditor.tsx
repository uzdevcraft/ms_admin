import { Button, Center, Group, Loader, Text } from '@mantine/core';
import { useQueryClient } from '@tanstack/react-query';
import type { UseFormReturn } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';

import { ErrorAlert } from '@/components/ErrorAlert';
import { PageHeader } from '@/components/PageHeader';
import { toast } from '@common/utils';
import { common, nav, productEditor } from '@/locale/uz';
import type * as Attributes from '@/modules/attributes/types';
import { useProductAttributes } from '@/modules/product-attributes';
import { Constants, Hooks, Validation } from '@modules/products';
import { CreateForm, UpdateForm, type CreateFormValues } from '@modules/products/forms';
import type * as Types from '@modules/products/types';

import { Editor } from './components/form';
import classes from './ProductEditor.module.css';

const LIST = '/products';

/** Scrolls to the first field with an error once React has rendered the messages. */
const focusFirstError = () =>
  requestAnimationFrame(() => {
    const target = document.querySelector('[aria-invalid="true"], [data-error="true"], .mantine-InputWrapper-error');
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

const ProductEditor = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const params = useParams<{ id: string }>();
  const id = Number(params.id) || 0;
  const isCreate = !id;

  const product = Hooks.useSingle(id, !isCreate);
  const attributes = useProductAttributes({ productId: id || undefined });

  // Checks that need server data: required category attributes and generated variants.
  const beforeSubmit = <T extends CreateFormValues>(values: T, form: UseFormReturn<T>) => {
    const categoryAttributes = queryClient.getQueryData<Attributes.IQuery.CategoryAttributes>([
      'attributes',
      'category',
      values.categoryId
    ]);
    const errors = Validation.validateExtras(values, categoryAttributes);
    const { setError } = form as unknown as UseFormReturn<CreateFormValues>;
    errors.forEach(error => setError(error.name, { type: 'manual', message: error.message }));

    if (errors.length) {
      toast.error(productEditor.fixErrors);
      focusFirstError();
    }
    return !errors.length;
  };

  const handleSuccess = (_: Types.IEntity.Product, values: CreateFormValues) => {
    toast.success(
      values.status === Constants.STATUS.draft
        ? productEditor.draftSaved
        : isCreate
          ? productEditor.submitted
          : productEditor.updated
    );
    navigate(LIST);
  };

  const handleError = (message: string) => toast.error(message || common.somethingWentWrong);

  const handleInvalid = () => {
    toast.error(productEditor.fixErrors);
    focusFirstError();
  };

  const renderBody = (
    { isLoading, setValue, getValues }: UseFormReturn<CreateFormValues> & { isLoading: boolean },
    currentStatus?: Types.IEntity.Status
  ) => (
    <>
      <Editor />
      <div className={classes.footer}>
        <Button
          type="submit"
          variant="default"
          loading={isLoading && getValues('status') === Constants.STATUS.draft}
          disabled={isLoading}
          onClick={() => setValue('status', Constants.STATUS.draft)}
        >
          {productEditor.saveDraft}
        </Button>
        <Button
          type="submit"
          loading={isLoading && getValues('status') !== Constants.STATUS.draft}
          disabled={isLoading}
          onClick={() =>
            setValue(
              'status',
              currentStatus && currentStatus !== Constants.STATUS.draft ? currentStatus : Constants.STATUS.review
            )
          }
        >
          {isCreate || currentStatus === Constants.STATUS.draft ? productEditor.submitReview : common.save}
        </Button>
      </div>
    </>
  );

  const title = isCreate ? productEditor.titleCreate : productEditor.titleEdit;
  const breadcrumbs = [
    { label: nav.products, to: LIST },
    { label: isCreate ? productEditor.breadcrumbNew : product.data?.name || productEditor.breadcrumbEdit }
  ];

  let content;

  if (isCreate) {
    content = (
      <CreateForm
        className={classes.form}
        onBeforeSubmit={beforeSubmit}
        onInvalid={handleInvalid}
        onSuccess={handleSuccess}
        onError={handleError}
      >
        {form => renderBody(form)}
      </CreateForm>
    );
  } else if (product.isLoading || attributes.isLoading) {
    content = (
      <Center className={classes.state}>
        <Loader />
      </Center>
    );
  } else if (product.isError) {
    content = <ErrorAlert isFetching={product.isFetching} refetch={product.refetch} />;
  } else if (!product.data) {
    content = (
      <Center className={classes.state}>
        <Text c="dimmed">{productEditor.notFound}</Text>
      </Center>
    );
  } else {
    content = (
      <UpdateForm
        product={product.data}
        attributes={attributes.data}
        className={classes.form}
        onBeforeSubmit={beforeSubmit}
        onInvalid={handleInvalid}
        onSuccess={handleSuccess}
        onError={handleError}
      >
        {form =>
          renderBody(
            form as unknown as UseFormReturn<CreateFormValues> & { isLoading: boolean },
            form.getValues('status')
          )
        }
      </UpdateForm>
    );
  }

  return (
    <PageHeader
      title={title}
      breadcrumbs={breadcrumbs}
      actions={
        <Group>
          <Button variant="default" onClick={() => navigate(LIST)}>
            {productEditor.cancel}
          </Button>
        </Group>
      }
    >
      {content}
    </PageHeader>
  );
};

export default ProductEditor;
