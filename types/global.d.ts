// Types for compiled templates
declare module '@summit-electric-supply/tokenfield/templates/*' {
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}
