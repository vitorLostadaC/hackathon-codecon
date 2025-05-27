import { getScreenContextReply } from './ai/main'
import Versions from './components/Versions'

export default function App(): React.JSX.Element {
  return (
    <>
      <button
        className="bg-red-500"
        onClick={async () => {
          await getScreenContextReply()
        }}
      >
        take screenshot
      </button>

      <Versions></Versions>
    </>
  )
}
