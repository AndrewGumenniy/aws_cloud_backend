import {Handler} from "aws-lambda";

import { fileParser } from "src/utils/file-parser";
import { formatJSONResponse } from "@libs/api-gateway";
import { FILE_PARSING_SUCCESS, StatuseCodeList } from "src/constants/http-response";

const importFileParser: Handler = async (event) => {
  try {
    console.log("import file parser event", event);

    for (const record of event.Records) {
      const objectKey = record.s3.object.key;

      await fileParser(objectKey);

      return formatJSONResponse(FILE_PARSING_SUCCESS, StatuseCodeList.Success);
    }
  } catch (error) {
    return formatJSONResponse({ message: error }, StatuseCodeList.ServerError);
  }
};

export const main = importFileParser;
