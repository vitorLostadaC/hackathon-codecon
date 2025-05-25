import { getTemporaryMessage } from './ai/main'
import Versions from './components/Versions'

export default function App(): React.JSX.Element {
  return (
    <>
      <button
        className="bg-red-500"
        onClick={async () => {
          await getTemporaryMessage()
        }}
      >
        take screenshot
      </button>

      <Versions></Versions>
    </>
  )
}
