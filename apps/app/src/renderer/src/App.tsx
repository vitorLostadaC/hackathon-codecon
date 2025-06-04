import { Pet } from './components/pet/pet'
// import Versions from "./components/Versions";
// import { getScreenContextReply } from "./ai/main";

export default function App(): React.JSX.Element {
	return (
		<>
			{/* <div className="min-h-screen bg-black/30">
        <div className="fixed bottom-4 right-4">
          <button
            type="button"
            className="px-4 py-2 bg-accent-primary text-white rounded-lg shadow-lg hover:bg-accent-secondary transition-colors"
            onClick={async () => {
              await getScreenContextReply();
            }}
          >
            Capturar Tela
          </button>
        </div>

        <Versions />
      </div> */}
			<Pet />
		</>
	)
}
