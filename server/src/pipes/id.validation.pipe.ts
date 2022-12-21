import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';

export class IdValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type !== 'param') return value;

    if (typeof +value !== 'number') {
      throw new BadRequestException('Invalid format id');
    }

    return value;
  }
}
