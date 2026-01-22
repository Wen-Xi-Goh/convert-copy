import type { FileData, FileFormat, FormatHandler } from "../FormatHandler.ts";

class svgForeignObjectHandler implements FormatHandler {

  public name: string = "svgForeignObject";

  public supportedFormats: FileFormat[] = [
    {
      name: "Hypertext Markup Language",
      format: "html",
      extension: "html",
      mime: "text/html",
      from: true,
      to: false,
      internal: "html"
    },
    {
      name: "Scalable Vector Graphics",
      format: "svg",
      extension: "svg",
      mime: "image/svg+xml",
      from: false,
      to: true,
      internal: "svg"
    }
  ];

  public ready: boolean = true;

  async init () {
    this.ready = true;
  }

  static htmlToXML (html: string) {
    const dummy = document.createElement("div");
    dummy.innerHTML = html;
    const serializer = new XMLSerializer();
    const xml = serializer.serializeToString(dummy);
    dummy.remove();
    return xml;
  }

  async doConvert (
    inputFiles: FileData[],
    inputFormat: FileFormat,
    outputFormat: FileFormat
  ): Promise<FileData[]> {

    if (inputFormat.internal !== "html") throw "Invalid input format.";
    if (outputFormat.internal !== "svg") throw "Invalid output format.";

    const outputFiles: FileData[] = [];

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    for (const inputFile of inputFiles) {
      const { name, bytes } = inputFile;
      const html = decoder.decode(bytes);
      const svg = (
`<svg width="1920" height="1080" xmlns="http://www.w3.org/2000/svg">
<foreignObject x="0" y="0" width="1920" height="1080">
${svgForeignObjectHandler.htmlToXML(html)}
</foreignObject>
</svg>`);
      const outputBytes = encoder.encode(svg);
      outputFiles.push({ name, bytes: outputBytes });
    }

    return outputFiles;

  }

}

export default svgForeignObjectHandler;
