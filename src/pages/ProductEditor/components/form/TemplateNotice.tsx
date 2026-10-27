import { IconInfoCircle } from '@tabler/icons-react';
import cx from 'clsx';

import { productEditor } from '@/locale/uz';
import type * as Attributes from '@/modules/attributes/types';

import classes from './Form.module.css';

type IProps = {
  data?: Attributes.IQuery.CategoryAttributes;
};

/**
 * Shown above prices when the category template brings no variant axes (no
 * template, an empty one, or specs only). Loading / error states are shown by
 * the spec section.
 */
const TemplateNotice = ({ data }: IProps) => {
  if (!data || (data.templateId && data.variants.length)) return null;

  return (
    <div className={cx(classes.banner, classes.bannerMuted)}>
      <IconInfoCircle size={18} className={classes.bannerIcon} />
      <span>
        {data.templateId ? productEditor.templateNoVariants(data.templateName) : productEditor.templateMissing}
      </span>
    </div>
  );
};

export default TemplateNotice;
