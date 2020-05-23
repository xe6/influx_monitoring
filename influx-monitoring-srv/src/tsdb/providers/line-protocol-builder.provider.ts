import { Injectable } from '@nestjs/common';

/*
  ! CAUTION: Use Lib instead to write points with official API when possible
*/

@Injectable()
export class LineProtocolBuilder {
  public buildWriteOperation(
    measurment: string,
    tags: Map<string, string>,
    fields: Map<string, string>,
  ): string {
    let preparedTags = '';
    let preparedFields = '';

    tags.forEach((val, key) => (preparedTags += `${key}=${val},`));
    fields.forEach((val, key) => (preparedFields += `${key}=${val},`));

    preparedTags = preparedTags.substring(0, preparedTags.length - 1); // Crop last comma
    preparedFields = preparedFields.substring(0, preparedFields.length - 1); // Crop last comma

    return `${measurment},${preparedTags} ${preparedFields} ${Date.now()}`;
  }
}
