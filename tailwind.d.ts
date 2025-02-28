declare module 'tailwindcss/lib/util/flattenColorPalette' {
    function flattenColorPalette(colors: Record<string, any>): Record<string, string>;
    export default flattenColorPalette;
  }
  
  declare module 'mini-svg-data-uri' {
    function svgToDataUri(svg: string): string;
    export default svgToDataUri;
  }