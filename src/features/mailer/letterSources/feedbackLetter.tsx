const feedbackLetter = (username: string | undefined, email: string) => `
<html lang="en">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Document</title>
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link
			href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
			rel="stylesheet"
		/>
		<style>
			body {
				font-family: Roboto, arial, sans-serif;
				background-color: #f2f2f2;
				margin: 0;
				padding: 0;
			}
			.container {
				background-color: #fff;
				max-width: 1000px;
				margin: 20px auto;
				padding: 20px;
				box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
			}
			.header {
				width: 100%;
			}
			.header .title {
				display: inline;
				color: #1877f2;
				font-size: 25px;
				margin-right: 10px;
				font-weight: 700;
			}
			.header p {
				display: inline;
				color: #1877f2;
				font-weight: 500;
				font-size: 18px;
			}

			.body p {
				font-size: 16px;
				line-height: 40px;
				color: #141823;
			}
			.body .wrapper {
				display: flex;
				justify-content: center;
				margin-bottom: 15px;
			}
			.body .code {
				display: inline-block;
				font-size: 20px;
				padding: 10px;
				background: #e7f3ff;
				border: 1px solid #1877f2;
				margin: 0 auto;
				border-radius: 7px;
			}
			.body .descr {
				font-size: 14px;
				line-height: 19px;
				color: #898f9c;
			}

			.footer p {
				font-size: 11px;
				color: #aaaaaa;
				line-height: 16px;
				line-height: 5px;
			}
			.footer a {
				color: #1b74e4;
				text-decoration: none;
				display: inline-block;
    			margin-top: 10px;
			}

			.divider {
				width: 100%;
				height: 1px;
				background-color: #000;
				opacity: 0.2;
				margin: 15px 0;
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="header">
				<h2 class="title">NotesApp</h2>
			</div>
			<div class="divider"></div>
			<div class="body">
				<p>Hey ${username},</p>
					<p style="margin-bottom: 10px">
						Thank you for reaching out to us. We appreciate your feedback.
					</p>
					<p>
					Your request is currently being processed, and we will get back to you shortly.
					</p>
					<p class="descr">
						Notes App is designed to assist you in staying organized and efficient with your tasks and responsibilities.
					</p>
				</div>
			<div class="divider"></div>
			<div class="footer">
				<p>
					This message is in response to your inquiry sent to
					<a href="mailto:${email}">${email}</a>.
				</p>
				<p>
					If you have any further questions or concerns, feel free to let us know. We're here to help!
				</p>
			</div>
		</div>
	</body>
</html>
`;

export default feedbackLetter;
