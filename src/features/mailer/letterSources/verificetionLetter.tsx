export const verificetionLetter = (
	username: string | undefined,
	email: string,
	code: string
) => `<!DOCTYPE html>
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
				background-color: #f2f2f2;
				border: 1px solid #ccc;
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
			@media (prefers-color-scheme: dark) {
				.divider {
					background-color: #fff;
				}
			}
		</style>
	</head>
	<body>
		<div class="container">
			<div class="header">
				<h2 class="title">NotesApp</h2>
				<p>Action required: Confirm your Facebook account</p>
			</div>
			<div class="divider"></div>
			<div class="body">
				<p>Hey ${username},</p>
				<p>
					You recently registered for Notes App. To complete your Facebook
					registration, please confirm your account.
				</p>
				<p style="margin-bottom: 10px">
					You may be asked to enter this confirmation code:
				</p>
				<div class="wrapper">
       					<div class="code">${code}</div>
				</div>
				<p class="descr">
					Notes App helps you stay organized and efficient in managing your
					tasks and responsibilities.
				</p>
			</div>
			<div class="divider"></div>
			<div class="footer">
				<p>
					This message was sent to
					<a href="mailto:${email}">${email}</a> at your request.
				</p>
				<p>
					To help keep your account secure, please don't forward this email.
				</p>
			</div>
		</div>
	</body>
</html>
`;
