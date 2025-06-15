/// <reference types="electron-vite/node" />

declare module '*?asset' {
	const value: string
	export default value
}

declare module '*?commonjs-external&asset' {
	const value: string
	export default value
}

declare module '*?asset&asarUnpack' {
	const value: string
	export default value
}
