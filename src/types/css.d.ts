declare module "*.module.css" {
  const classes: {
    readonly [key: string]: string & {
      dvw?: string;
      dvh?: string;
    };
  };
  export default classes;
}
