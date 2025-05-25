import { getTemporaryMessage } from './ai/main'
import Versions from './components/Versions'

export default function App(): React.JSX.Element {
  return (
    <>
      <button
        className="bg-red-500"
        onClick={async () => {
          const message = await getTemporaryMessage()
          console.log(message)
        }}
      >
        take screenshot
      </button>

      <Versions></Versions>
    </>
  )
}
