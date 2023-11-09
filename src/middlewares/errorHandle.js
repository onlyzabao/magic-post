const errorHandle = (req, res, next) => {
	res.status(404).json({
		ok: false,
		data: null,
		errorCode: "URL_NOT_FOUND",
		message: "URL_NOT_FOUND"
	})
}
export default errorHandle