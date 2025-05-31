import duckStopped from '../../../assets/animals/duck/stopped-duck.png'

export function HomeTab(): React.JSX.Element {
	return (
		<div className="flex items-center justify-center h-full">
			<img src={duckStopped} alt="Duck facing forward" className="w-64 h-64 object-contain" />
		</div>
	)
}
