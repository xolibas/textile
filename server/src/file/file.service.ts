import { Injectable } from '@nestjs/common';
import { path } from 'app-root-path';
import { ensureDir, writeFile, remove } from 'fs-extra';
import { FileResponse } from './file.interface';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Injectable()
export class FileService {
  async saveFiles(files: Express.Multer.File[], folder = 'default'): Promise<FileResponse[]> {
    const uploadFolder = `${path}/uploads/${folder}`;
    await ensureDir(uploadFolder);

    const res: FileResponse[] = await Promise.all(
      files.map(async (file) => {
        const fileName = uuidv4() + extname(file.originalname);

        await writeFile(`${uploadFolder}/${fileName}`, file.buffer);

        return {
          url: `/uploads/${folder}/${fileName}`,
          name: fileName,
        };
      })
    );

    return res;
  }

  async deleteFile(fileUrl: string) {
    await remove(`${path}${fileUrl}`).catch(() => console.log('File with this url is not found'));
  }
}
