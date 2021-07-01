<?php
$dirname=dirname(__FILE__);
require_once '../zip.php';
?>
<!DOCTYPE html>
<html>
<head>
	<title>Full Widget</title>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<link rel="shortcut icon" href="https://apifootball.com/img/favicon.ico" type="image/x-icon" />
	<link rel="apple-touch-icon" href="https://apifootball.com/img/favicon.ico">

	<!-- Bootstrap CSS -->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
	<!-- Font Awesome CSS -->
	<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">

	<style type="text/css">
		body, html {
			margin: 0; padding: 0; height: 100%; overflow: hidden;
		}
		#content {
			position:absolute; left: 0; right: 0; bottom: 0; top: 0;
		}
		.form-inline {
			padding-top: 10px;
			background-color: #27282a;
			color: white!important;
		}
	</style>
</head>
<body>
<div id="content">
	<form class="form-inline">
		<div class="container-fluid mb-3">
			<div class="toggle-forms">
				<div class="row align-items-end">
					<div class="col-md-3">
						<div class="form-group">
							<label for="api_key" class="">Widget Key:</label>
							<input type="text" <?php if(!$_SESSION['user_key']) echo 'readonly';  ?> class="form-control w-100" id="api_key" name="api_key" value="<?php echo $GLOBALS['api_key'];  ?>">
						</div>
					</div>
					<div class="col-md-3">
						<div class="form-group">
							<label for="domains" class="">IP/Domains:</label>
							<input type="text" <?php if(!$_SESSION['user_key']) echo 'readonly';  ?> class="form-control w-100" id="domains" name="domains" value="<?php echo $GLOBALS['domains'];  ?>" placeholder="">
						</div>
					</div>
					<div class="col-md-2 my-2 my-md-0">
						<button type="submit" <?php if(!$_SESSION['user_key']) echo 'disabled';  ?> class="btn w-100" style="flex: 1; background-color: #ffc107!important;">Save Settings</button>
					</div>
					<div class="col-md-3 my-2 my-md-0">
						<a class="btn btn-success w-100" style="flex: 1;" href="<?php echo $href; ?>" role="button">
								<?php echo ((!$_SESSION['user_key']) ? 'For Download, click to log in' : 'Download Widget') ?>
						</a>
					</div>
					<div class="col-md-1 my-2 my-md-0">
						<a class="btn btn-dark w-100" href="https://apifootball.com/widgets-documentation/" role="button">Back</a>
					</div>
				</div>
				<?php echo ((!$_SESSION['user_key']) ? '<div class="row"><h6 class="mx-5 mt-2">* in order to be able to complete these fields, you need to be loged in</h6></div>' : '') ?>
			</div>
			<div class="row text-center mt-2">
				<div class="col-md-12">
				<p class="btn btn-danger toggle-forms-btn mb-0 w-100">Hide Settings and display full page</p>
				</div>
			</div>
		</div>
	</form>
	<iframe width="100%" height="100%" frameborder="0" src="https://apifootball.com/widgets/full/index.html" />
</div>
<iframe src=""></iframe>
<script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
<script type="text/javascript">
	$(".toggle-forms-btn").on("click", function(){
		$('.toggle-forms').toggle();
		$(this).text($(this).text() == 'Hide Settings and display full page' ? 'Show Settings' : 'Hide Settings and display full page');
	});
</script>
</body>
</html>