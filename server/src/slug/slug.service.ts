import { Injectable } from '@nestjs/common';
import slugify = require('slug');
import { Not, Repository } from 'typeorm';

@Injectable()
export class SlugService {
  async generateSlug(name: string, repo: Repository<any>, id?: number): Promise<string> {
    let oldcharacteristic,
      slugNumber = 0,
      slug;

    do {
      slug = slugify(`${name}${slugNumber ? '-' + slugNumber : ''}`);

      oldcharacteristic = await repo.findOneBy(id ? { slug: slug, id: Not(id) } : { slug: slug });

      if (oldcharacteristic) slugNumber++;
    } while (oldcharacteristic);

    return slug;
  }
}
