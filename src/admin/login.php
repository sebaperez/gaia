<!DOCTYPE html>
<!--[if IE 9 ]><html class="ie9"><![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Material Admin</title>

        <!-- Vendor CSS -->
        <link href="vendors/bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css" rel="stylesheet">
        <link href="vendors/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css" rel="stylesheet">
	<link href="vendors/sweetalert2/sweetalert2.min.css" rel="stylesheet">

        <!-- CSS -->
        <link href="css/app_1.min.css" rel="stylesheet">
	<link href="css/css.css" rel="stylesheet">
   </head>

    <body>
        <div class="login-content">
            <!-- Login -->
            <div class="lc-block toggled" id="l-login">
                <div class="lcb-form">
                    <div class="form-group">
                        <div class="fg-line">
                            <input type="text" id="email" class="form-control login" placeholder="Correo electronico">
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="fg-line">
                            <input type="password" id="password" class="form-control login" placeholder="Contraseña">
                        </div>
                    </div>

                    <div class="checkbox">
                        <label>
                            <input type="checkbox" value="">
                            <i class="input-helper"></i>
                            Mantenerme identicado
                        </label>
                    </div>

                    <a href="#!" id="loginBtn" class="btn btn-login btn-success"><i class="zmdi zmdi-arrow-forward"></i></a>
                </div>

                <div class="lcb-navigation">
                    <a href="" data-ma-action="login-switch" data-ma-block="#l-register"><i class="zmdi zmdi-plus"></i> <span>Registrar</span></a>
                </div>
            </div>

            <!-- Register -->
            <div class="lc-block" id="l-register">
                <div class="lcb-form">
		<?php
			$fields = [
				[ "title" => "Nombre", "name" => "name", "type" => "text" ],
				[ "title" => "Apellido", "name" => "lastname", "type" => "text" ],
				[ "title" => "E-Mail", "name" => "email", "type" => "text" ],
				[ "title" => "Contraseña", "name" => "password", "type" => "password" ],
				[ "title" => "Nombre del asistente", "name" => "botName", "type" => "text" ],
				[ "title" => "E-Mail del asistente", "name" => "botEmail", "type" => "text" ]
			];

			foreach ($fields as $field) {

		?>

                    <div class="form-group">
                        <div class="fg-line">
                            <input type="<?php echo($field["type"]); ?>" class="form-control register" placeholder="<?php echo($field["title"]); ?>" name="<?php echo($field["name"]); ?>">
                        </div>
                    </div>

		<?php } ?>


                    <a href="#!" class="btn btn-login btn-success" id="registerBtn"><i class="zmdi zmdi-check"></i></a>
                </div>

                <div class="lcb-navigation">
                    <a href="" data-ma-action="login-switch" data-ma-block="#l-login"><i class="zmdi zmdi-long-arrow-right"></i> <span>Ingresar</span></a>
                </div>
            </div>

            <!-- Forgot Password -->
            <div class="lc-block" id="l-forget-password">
                <div class="lcb-form">
                    <p class="text-left">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla eu risus. Curabitur commodo lorem fringilla enim feugiat commodo sed ac lacus.</p>

                    <div class="fg-line">
                        <input type="text" class="form-control" placeholder="Email Address">
                    </div>

                    <a href="" class="btn btn-login btn-success"><i class="zmdi zmdi-check"></i></a>
                </div>

                <div class="lcb-navigation">
                    <a href="" data-ma-action="login-switch" data-ma-block="#l-login"><i class="zmdi zmdi-long-arrow-right"></i> <span>Sign in</span></a>
                    <a href="" data-ma-action="login-switch" data-ma-block="#l-register"><i class="zmdi zmdi-plus"></i> <span>Register</span></a>
                </div>
            </div>
        </div>

        <!-- Javascript Libraries -->
        <script src="vendors/bower_components/jquery/dist/jquery.min.js"></script>
        <script src="vendors/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
        <script src="vendors/bower_components/Waves/dist/waves.min.js"></script>
	<script src="vendors/bootstrap-growl/bootstrap-growl.min.js"></script>
	<script src="vendors/notify.js"></script>

        <script src="js/app.min.js"></script>
	<script src="js/base.js"></script>
	<script src="js/login.js"></script>
 
    </body>
</html>
