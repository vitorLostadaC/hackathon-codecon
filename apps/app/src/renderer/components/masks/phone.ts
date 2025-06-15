export const maskPhone = (phone: string) => {
	return phone
		.replace(/\D/g, '')
		.replace(/(\d)/, '($1')
		.replace(/(\d{2})(\d)/, '$1) $2')
		.replace(/(\d{4})(\d)/, '$1-$2')
		.replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
		.replace(/(\d{4})\d+?$/, '$1')
}
