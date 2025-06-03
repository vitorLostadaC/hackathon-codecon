import { getScreenContextReply } from "./ai/main";
import Versions from "./components/Versions";

export default function App(): React.JSX.Element {
  return (
    <>
      <button
        type="button"
        className="bg-red-500"
        onClick={async () => {
          const a = await getScreenContextReply();
          console.log(a);
        }}
      >
        take screenshot
      </button>

      <Versions />
    </>
  );
}
