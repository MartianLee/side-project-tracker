import { FunType } from '../domain/types';
import { useLang } from '../i18n';

export function FunTypeChip({ funType }: { funType: FunType }) {
  const { t } = useLang();
  return (
    <span className={`fun fun--${funType}`}>
      {t.funLabel[funType]}
    </span>
  );
}
