import { data as dcmjsData } from "dcmjs";

const { DicomMetaDictionary, DicomMessage } = dcmjsData;

export type DicomFileContent = {
  [key: string]: unknown
}

export class DicomFile {
  private content: DicomFileContent;
  private meta: DicomFileContent;

  constructor(fileArrayBuffer: ArrayBuffer) {
    const data = DicomMessage.readFile(fileArrayBuffer);

    this.content = this.transformProxyIntoPlainObject(
      DicomMetaDictionary.naturalizeDataset(data.dict)
    ) as DicomFileContent;

    this.meta = this.transformProxyIntoPlainObject(
      DicomMetaDictionary.naturalizeDataset(data.meta)
    ) as DicomFileContent;
  }

  private transformProxyIntoPlainObject(possibleProxy: unknown) {
    if (!this.isProxy(possibleProxy)) {
      return possibleProxy;
    }

    if (Array.isArray(possibleProxy)) {
      return [...possibleProxy];
    }

    const plainObject: DicomFileContent = Object.assign({}, possibleProxy);

    Object.keys(plainObject).forEach((key) => {
      plainObject[key] = this.transformProxyIntoPlainObject(plainObject[key]);
    });

    return plainObject;
  }

  private isProxy(obj: unknown) {
    try {
      Proxy.revocable(obj as ProxyHandler<DicomFileContent>, {});
      return true;
    } catch (e) {
      return !e;
    }
  }
}
