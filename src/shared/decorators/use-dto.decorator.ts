import { AbstractEntity } from '@shared/common/base.entity';
import type { AbstractDto } from '@shared/common/dto/abstract.dto';
import { Constructor } from '@shared/common/type/constructor';

export const UseDto = (
  dtoClass: Constructor<AbstractDto, [AbstractEntity, unknown]>,
): ClassDecorator => {
  return (ctor) => {
    ctor.prototype.dtoClass = dtoClass;
  };
};
