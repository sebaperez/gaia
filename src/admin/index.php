<!DOCTYPE html>
<!--[if IE 9 ]><html class="ie9"><![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Gaia | gaiameet.com</title>

        <!-- Vendor CSS -->
        <link href="vendors/bower_components/material-design-iconic-font/dist/css/material-design-iconic-font.min.css" rel="stylesheet">
        <link href="vendors/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.min.css" rel="stylesheet">

        <!-- CSS -->
        <link href="css/app_1.min.css" rel="stylesheet">
	<link href="css/app_2.min.css" rel="stylesheet">
    </head>

    <body>
	<script src="vendors/bower_components/jquery/dist/jquery.min.js"></script>
	<script src="js/base.js"></script>
	<script src="js/admin.js"></script>
        <header id="header" class="clearfix" data-ma-theme="blue">
            <ul class="h-inner">
                <li class="hi-trigger ma-trigger" data-ma-action="sidebar-open" data-ma-target="#sidebar">
                    <div class="line-wrap">
                        <div class="line top"></div>
                        <div class="line center"></div>
                        <div class="line bottom"></div>
                    </div>
                </li>

                <li class="hi-logo hidden-xs">
                    <a href="index.php">Gaia</a>
                </li>

                <li class="pull-right">
                    <ul class="hi-menu">

                        <li data-ma-action="logout">
                            <a href="#!" id="logout"><i class="him-icon zmdi zmdi-power"></i></a>
                        </li>

                    </ul>
                </li>
            </ul>

            <!-- Top Search Content -->
            <div class="h-search-wrap">
                <div class="hsw-inner">
                    <i class="hsw-close zmdi zmdi-arrow-left" data-ma-action="search-close"></i>
                    <input type="text">
                </div>
            </div>
        </header>

        <section id="main">
            <aside id="sidebar" class="sidebar c-overflow">
                <div class="s-profile">
                    <a href="" data-ma-action="profile-menu-toggle">
                        <div class="sp-pic">
                            <img src="img/profile-pics/1.jpg" alt="">
                        </div>

                        <div class="sp-info">
                            <i class="zmdi zmdi-caret-down"></i>
                        </div>
                    </a>

                </div>

                <ul class="main-menu">
                    <li class="active"><a id="dashboard" href="#"><i class="zmdi zmdi-home"></i> Dashboard</a></li>
                    <li><a href="#!" id="settings"><i class="zmdi zmdi-settings"></i> Configuración</a></li>
                    <li><a href="#!" id="historial"><i class="zmdi zmdi-chart"></i> Historial</a></li>
                </ul>
            </aside>

            <section id="content">
                <div class="container">
			<div class="block-header">
				<h2></h2>
			</div>
			<div id="content-body">
			</div>
                </div>
            </section>
        </section>

        <footer id="footer">
        </footer>

        <!-- Javascript Libraries -->
        <script src="vendors/bower_components/jquery/dist/jquery.min.js"></script>
        <script src="vendors/bower_components/bootstrap/dist/js/bootstrap.min.js"></script>
        <script src="vendors/bower_components/malihu-custom-scrollbar-plugin/jquery.mCustomScrollbar.concat.min.js"></script>

        <script src="js/app.min.js"></script>
	<script>
		admin.fill();
	</script>
    </body>
  </html>
