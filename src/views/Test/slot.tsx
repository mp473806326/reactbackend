export function MyComponent(props: {listApi: string, header: React.ReactNode; main: React.ReactNode; footer: React.ReactNode }) {
    return (
      <div>
        <div>MyComponent组件listApi:{props.listApi}</div>
        <header>{props.header}</header>
        <main>{props.main}</main>
        <footer>{props.footer}</footer>
      </div>
    );
  }