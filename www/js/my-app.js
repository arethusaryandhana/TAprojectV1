var $$ = Dom7;
var server = 'http://e-curhat.000webhostapp.com';


var app = new Framework7({
	root: '#app',
	name: 'eCurhat',
	cache: false,
	id: 'com.ubaya.f7app',
	panel: { swipe: 'left' },
	theme: 'md',
	routes: [
		{
			path: '/index/',
			url: 'index.html',
			on: {
				pageInit: function(e, page){
					user = localStorage.username;
					console.log(user);
				}
			}
		},
		{
			path: '/login/',
			url: 'login.html',
			on: {
				pageInit: function(e, page){
					$$("#btnsignin").on('click', function(){

				        var username = $$('#user').val();
						var password = $$('#passwordlogin').val();

						var x = new FormData($$('.form-login')[0]);
						
						app.request.post(server + '/ecurhat/login.php',
							{username:username, password:password}, function(data){
								localStorage.username = username;
								// console.log(data);
								// app.dialog.alert(data);
								if(data == "Kosong"){
									app.dialog.alert('Anda Belum terdaftar');
								}
								else{
									var obj = JSON.parse(data);
									for (var i = 0; i < obj.length; i++){
										var usern = obj[i]['username'];
										var pass = obj[i]['password'];
										var kategori = obj[i]['status'];
										
										if(kategori == 'klien'){
											localStorage.kategori = kategori;
											page.router.navigate('/beranda/');
										}
										else if(kategori == 'konselor'){
											localStorage.kategori = kategori;
											page.router.navigate('/berandabackend/');
										}
										else if(kategori == 'admin'){
											localStorage.kategori = kategori;
											page.router.navigate('/berandabackend/');
										}
										else if(kategori != 'admin' && kategori != 'konselor' && kategori != 'klien'){
											app.dialog.alert('Anda Belum terdaftar');
										}		
										// if(username != usern){
										// 	app.dialog.alert('Anda Belum terdaftar');
										// }
										// else{

										// 	if(kategori == 'klien'){
										// 		localStorage.kategori = kategori;
										// 	page.router.navigate('/beranda/');
										// 	}
										// 	else if(kategori == 'konselor'){
										// 		localStorage.kategori = kategori;
										// 		page.router.navigate('/berandabackend/');
										// 	}
										// 	else if(kategori == 'admin'){
										// 		localStorage.kategori = kategori;
										// 		page.router.navigate('/berandabackend/');
										// 	}
										// 	else if(kategori != 'admin' && kategori != 'konselor' && kategori != 'klien'){
										// 		app.dialog.alert('Anda Belum terdaftar');
										// 	}								
										// }
									}
								}
								
							
						});

						app.panel.disableSwipe();
					});
				},
			}
		},
		{
			path: '/beranda/',
			url: 'beranda.html',
			on:{
				pageInit: function(e, page){
					username = localStorage.username;
					localStorage.kategori = 'klien';
					var welcome = "Selamat Datang " + '"' + username + '"' ;
					$$('#welcome').html(welcome);
					//sebenarnya ada 5 tapi yang diajarkan hanya 3

					$$('.delete-storage-data').on('click', function() {
			 			// localStorage.removeItem("username");
			 			// localStorage.clear();
						window.localStorage.clear();
						  // app.dialog.alert('Form data deleted')
					});
					
					
					$$('#btnkeluhan').on('click', function(){
						app.request.post(server + '/ecurhat/checkkeluhan.php', {username}, function(data){
							// app.dialog.alert(data);
							if(data == "Kosong"){
								page.router.navigate('/keluhan/');
							}
							else{
								var result = JSON.parse(data);
								for (var i = 0; i < result.length; i++) {
									
									if(result[i]['status_keluhan'] != 7){
										app.dialog.alert("Maaf, belum bisa menulis keluhan");
									}
									else{
										page.router.navigate('/keluhan/');
									}
								}
							}
						});
					})
				},
				pageAfterIn: function(e, page){
					if (!localStorage.username) {
						page.router.navigate('/login/');
					}
				}
			}
		},
		{
			path: '/register/',
			url: 'register.html',
			on:{
				pageInit: function(e, page){

					app.request.post(server + '/ecurhat/showkecamatan.php', {}, function(data){
						var result = JSON.parse(data);
							for (var i = 0; i < result.length; i++) {
								var str = "<option value='" + result[i]['idkecamatan'] + "'>"+ result[i]['nama_kecamatan'] +"</option>";
											
								$$('#pickerkecamatan').append(str);
							}
					});

					app.request.post(server + '/ecurhat/showkelurahan.php', {}, function(data){
						var result = JSON.parse(data);
							for (var i = 0; i < result.length; i++) {

								var stri = "<option value='" + result[i]['idkelurahan'] + "'>"+ result[i]['namakelurahan'] +"</option>";
											
								$$('#pickerkelurahan').append(stri);
							}
					});

					$$('#btndaftar').on('click', function(){
						var username = $$('#username').val();
						var password = $$('#password').val();
						var confirmpass = $$('#confirmpassword').val();
						var namal = $$('#namalengkap').val();
						var noktp = $$('#noktp').val();
						var jk = $$('#jeniskelamin').val();
						var tgl = $$('#tanggallahir').val();
						var alamat = $$('#alamat').val();
						var kec = $$('#pickerkecamatan').val();
						var kel = $$('#pickerkelurahan').val();
						var notelp = $$('#notelp').val();
						var email  = $$('#email').val();

						if(username != '' && password != '' && confirmpass != '' && namal != '' && noktp != '' && jk != ''
							&& tgl != '' && alamat != '' && kec != '' && kel != '' && notelp != '' && email != '' ){

							if (password == confirmpass) {

								var x = new FormData($$('.register')[0]);
								app.request.post(server + '/ecurhat/registeruser.php', x, function(data){
				               		app.dialog.alert("Akun anda berhasil terdaftar");
				               		page.router.refreshPage();
				               		page.router.navigate('/login/');
				              	});
							}
							else
							{
								app.dialog.alert('Mohon Periksa kembali password anda!');
							}
						}
						else{
							app.dialog.alert('Mohon periksa kembali data diri anda');
						}
						

					});
					
				},
			}
		},
		{
			path: '/berandabackend/',
			url: 'berandabackend.html',
			on:{
				pageInit: function(e, page){
					username = localStorage.username;
					kategori = localStorage.kategori;
					var welcome = "Selamat Datang " + '"' + username + '"' ;
					if (kategori == 'admin') {
						if(username == 'kasie'){
							var usernm = "<input type='hidden' name='user_name' id='user_name' value='"+ username +"'>";
							$$('#username').html(usernm);
							console.log(username + " " + kategori);
							var ad = "<a href='/daftarkeluhan/'' class='col button button-big button-fill' id='btnlist'>Daftar Keluhan (Assesment) </a>" +
							"<br>" + 
			                "<a href='/listkategori/' class='col button button-big button-fill' id='btnlist'>Lihat Daftar Kategori Kasus</a>" +
			                "<br>" +
			                "<a href='/listkonselor/' class='col button button-big button-fill' id='btnlist'>Lihat Daftar Konselor</a>" +
			                "<br>" + 
			                "<a href='/daftarkonfirmasichat/' class='col button button-big button-fill' id='btnlist'>Daftar Konfirmasi Chat</a>" +
			                "<br>" + 
			                "<a href='/listvalmasuk/' class='col button button-big button-fill' id='btnlist'>Daftar Validasi Laporan Masuk</a>" +
			                "<br>" + 
			                "<a href='/listvalakhir/' class='col button button-big button-fill' id='btnlist'>Daftar Validasi Laporan Akhir</a>" +
			                "<br>";
			            	$$('#tambah').html(ad);

			            	$$('.delete-storage-data').on('click', function() {
								window.localStorage.clear();
					 			// localStorage.removeItem('username');
					 			// localStorage.clear();
								 //  var storedData = app.dialog.formDeleteData('beranda-konselor');
								  // app.dialog.alert('Form data deleted')
							});							
						}
						if(username == 'kabid'){
							var usernm = "<input type='hidden' name='user_name' id='user_name' value='"+ username +"'>";
							$$('#username').html(usernm);

							var ad = "<a href='/listvalmasuk/' class='col button button-big button-fill' id='btnlist'>Daftar Validasi Laporan Masuk</a>" +
			                "<br>" + 
			                "<a href='/listvalakhir/' class='col button button-big button-fill' id='btnlist'>Daftar Validasi Laporan Akhir</a>" +
			                "<br>";
			            	$$('#tambah').html(ad);
			            	$$('.delete-storage-data').on('click', function() {
								window.localStorage.clear();
					 			// localStorage.removeItem('username');
					 			// localStorage.clear();
								 //  var storedData = app.dialog.formDeleteData('beranda-konselor');
								  // app.dialog.alert('Form data deleted')
							});
						}
						if(username == 'kadis'){
							var usernm = "<input type='hidden' name='user_name' id='user_name' value='"+ username +"'>";
							$$('#username').html(usernm);

							var ad = "<a href='/listvalmasuk/' class='col button button-big button-fill' id='btnlist'>Daftar Validasi Laporan Masuk</a>" +
			                "<br>" + 
			                "<a href='/listvalakhir/' class='col button button-big button-fill' id='btnlist'>Daftar Validasi Laporan Akhir</a>" +
			                "<br>";
			            	$$('#tambah').html(ad);
			            	$$('.delete-storage-data').on('click', function() {
								window.localStorage.clear();
					 			// localStorage.removeItem('username');
					 			// localStorage.clear();
								 //  var storedData = app.dialog.formDeleteData('beranda-konselor');
								  // app.dialog.alert('Form data deleted')
							});
						}
						if(username == 'walikota'){
							var usernm = "<input type='hidden' name='user_name' id='user_name' value='"+ username +"'>";
							$$('#username').html(usernm);

							var ad = "<a href='/listvalmasuk/' class='col button button-big button-fill' id='btnlist'>Daftar Validasi Laporan Masuk</a>" +
			                "<br>" + 
			                "<a href='/listvalakhir/' class='col button button-big button-fill' id='btnlist'>Daftar Validasi Laporan Akhir</a>" +
			                "<br>";
			            	$$('#tambah').html(ad);
			            	$$('.delete-storage-data').on('click', function() {
								window.localStorage.clear();
					 			// localStorage.removeItem('username');
					 			// localStorage.clear();
								 //  var storedData = app.dialog.formDeleteData('beranda-konselor');
								  // app.dialog.alert('Form data deleted')
							});
						}
						$$("#chatting").hide();	
					}
					else if (kategori == 'konselor'){
						var usernm = "<input type='hidden' name='user_name' id='user_name' value='"+ username +"'>";
						var kat = "<input type='hidden' name='kategori' id='kategori' value='"+ kategori +"'>";
						$$('#username').html(usernm,kat);
						var ad = "<a href='/daftarkeluhan/'' class='col button button-big button-fill' id='btnlist'>Daftar Keluhan (Assesment) </a>" +
							"<br>" + 
			                "<a href='/daftarprogress/' class='col button button-big button-fill' id='btnlist'>Progress Harian Keluhan</a>" + "<br>" +
			                "<a href='/laporankonselor/' class='col button button-big button-fill' id='btnlist'>Laporan Konselor</a>";
			            $$('#tambah').html(ad);
			            $$('.delete-storage-data').on('click', function() {
							window.localStorage.clear();
				 			// localStorage.removeItem('username');
				 			// localStorage.clear();
							 //  var storedData = app.dialog.formDeleteData('beranda-konselor');
							  // app.dialog.alert('Form data deleted')
						});

					}


					$$('.title').html(kategori);
					$$('#welcome').html(welcome);
					$$('#btnBatal').on('click', function(){
						page.router.navigate('/profil/');
					});

					
				},
				pageAfterIn: function(e, page){
					if (!localStorage.username) {
						page.router.navigate('/login/');
					}
				}
			}
		},
		{
			path:'/keluhan/',
			url: 'keluhan.html', 
			on:{
				pageInit: function(e, page){
					app.panel.disableSwipe();
					$$('#datadilaporkan').hide();
					$$('#status').show();

					$$("#cekpelapor").on('change', function(){
						if($$('#cekpelapor').is(":checked")){
							$$('#datadilaporkan').show();
							$$('#cekidentitas').hide();
							$$('#status').hide();
						}
						else{
							$$('#datadilaporkan').hide();
							$$('#cekidentitas').show();
							
						}
					});

					var checkboxidentitas = 
					"<li>" +
	                    "<label class='item-checkbox item-content'>" + 
	                      "<input type='checkbox' id='cekanon' name='cekanon' value='"+ identitas +"'/>" + 
	                      "<i class='icon icon-checkbox'></i>" +
	                      "<div class='item-inner'>" + 
	                        "<div class='item-title'>Sebagai Anonymous</div>" +
	                      "</div>"
	                    "</label>"
	                "</li>";
	                $$('#cekidentitas').html(checkboxidentitas);
					
					var identitas ="klien"; 

	                $$('#cekanon').on('change', function(){
						if($$('#cekanon').is(":checked")){
							identitas = "anonymous";
						}
						else{
							identitas = "klien";
						}
					});

	                // var pelapor = tidak;

					// $$("#cekpelapor").on('change', function(){
					// 	if($$('#cekpelapor').is(":checked")){
					// 		pelapor = ya;	
					// 	}
					// 	else{
					// 		pelapor = tidak;
					// 	}
					// });

					app.request.post(server + '/ecurhat/showkecamatan.php', {}, function(data){
						var result = JSON.parse(data);
							for (var i = 0; i < result.length; i++) {
								var str = "<option value='" + result[i]['idkecamatan'] + "'>"+ result[i]['nama_kecamatan'] +"</option>";
											
								$$('#pickerkecamatan').append(str);
							}
					});


					app.request.post(server + '/ecurhat/showkelurahan.php', {}, function(data){
						var result = JSON.parse(data);
							for (var i = 0; i < result.length; i++) {
								var str = "<option value='" + result[i]['idkelurahan'] + "'>"+ result[i]['namakelurahan'] +"</option>";
											
								$$('#pickerkelurahan').append(str);
							}
					});


					$$("#btnkrmkeluhan").on('click', function(){
						// app.dialog.alert(identitas);

						username = localStorage.username;
				       	// app.dialog.alert(username);
				       	var usernm = "<input type='hidden' name='user_name' id='user_name' value='"+ username +"'>";
				       	var iden = "<input type='hidden' name='identitas_klien' id='identitas_klien' value='"+ identitas +"'>";
				       	// var p = "<input type='hidden' name='status_pelapor' id='status_pelapor' value='"+ pelapor +"'>";
						$$('#username').html(usernm);
						$$('#status_identitas').html(iden);
						// $$('#statusdilaporkan').html(p);
						// var z = new FormData($$('.keluhan')[0]);
						// 									console.log(z);
						var judulkeluhan = $$('#topik_pesan').val();
						var pesancurhat = $$('#isi_pesan').val();
						

						if (judulkeluhan != '' && pesancurhat != '') {
							
							var cekstatus = "dirisendiri";
							
							
								if($$('#cekpelapor').is(":checked")){
									// app.dialog.alert("aaaa");
									var namadilaporkan = $$('#namalengkap').val();
									var umurdilaporkan = $$('#umur').val();
									var jeniskel = $$('#jenis_kelamin').val();
									var alamatdilaporkan = $$('#alamat').val();
									var kelurahan = $$('#pickerkecamatan').val();
									var kelurahan = $$('#pickerkelurahan').val();
									var statusdilapor = $$('#pickerstatus').val();
									cekstatus = "tambahorang";

									if (namadilaporkan != '' || umurdilaporkan != '' || jeniskel != '' || alamatdilaporkan != '' || kelurahan != '' || statusdilapor != '') {

										app.request.post(server + '/ecurhat/insertkeluhan.php', {username,identitas,judulkeluhan,pesancurhat,namadilaporkan,umurdilaporkan,jeniskel,alamatdilaporkan,kelurahan,statusdilapor, cekstatus}, function(data){
											// var lastidkeluhan = "<input type='hidden' name='keluhan_id' id='keluhan_id' value='"+idkeluhan+"'>";
											// $$('#lastidkeluhan').html(lastidkeluhan);
											if(data == 'berhasil'){
												app.dialog.alert("Keluhan berhasil ditambahkan, silahkan menunggu tanggapan.");
											}
											
										});
										page.router.navigate('/beranda/');
									}
									else{
										app.dialog.alert('Mohon lengkapi data yang dilaporkan sebelum mengirim keluhan.');
									}	
								}
								else{
									// app.dialog.alert(username);
									
									cekstatus = "dirisendiri";
									var x = new FormData($$('.keluhan')[0]);
									app.request.post(server + '/ecurhat/insertkeluhan.php', {username,identitas,judulkeluhan,pesancurhat, cekstatus}, function(data){
										if(data == 'berhasil'){
											app.dialog.alert("Keluhan berhasil ditambahkan, silahkan menunggu tanggapan.");
										}
									});
									page.router.navigate('/beranda/');
								}
							
						}
						else {
							app.dialog.alert('Mohon lengkapi data keluhan sebelum mengirim keluhan.');
						}
						var judul = "Pemberitahuan";
						var isi	= "Anda Mendapatkan Pengaduan Baru";
						app.request.post(server + '/ecurhat/notif.php',
							{judul, isi}, function(data){
								$$(document).on('deviceready', function() {
									var notificationOpenedCallback = function(jsonData) {
								    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
								  };

								  window.plugins.OneSignal
								    .startInit("ae0c3b87-ce80-465e-a424-80ebfc9448ab")
								    .handleNotificationOpened(notificationOpenedCallback)
								    .endInit(); 
								    window.plugins.OneSignal.setSubscription(true);
								    window.plugins.OneSignal.enableNotificationWhenActive(true);
								}, false);
							
						});
					});

					$$("#btnbtlkeluhan").on('click', function(){
						app.dialog.confirm('Apakah anda yakin ingin meembatalkan pesan keluhan ini?', function () {
						    page.router.navigate('/beranda/');
						  });
					});
					//sebenarnya ada 5 tapi yang diajarkan hanya 3
				},
			}
		},
		{
			path: '/daftarkeluhan/',
			url: 'daftarkeluhan.html',
			on:{ 
				pageInit: function(e, page){
					app.panel.disableSwipe();
					username = localStorage.username;
					status = localStorage.kategori;
					tipehal = "keluhanmasuk";
					localStorage.tipehal = tipehal;

					app.request.post(server + '/ecurhat/showlistkeluhan.php', {username, status, tipehal} , function(data){
					var obj = JSON.parse(data);
						for (var i = 0; i < obj.length; i++) {
							var str = 
							"<li>" +
			                  "<a href='/viewkeluhan/"+ obj[i]['id_keluhan'] +"' class='item-link item-content'>" +
			                    "<div class='item-inner'>" +
			                      "<div class='item-title-row'>" +
			                        "<div class='item-title'>"+ obj[i]['topik_pesan'] +"</div>" +
			                        "<div class='item-after'>"+ obj[i]['tanggal_diterima'] +"</div>" +
			                      "</div>" +
			                      "<div class='item-text'>" + obj[i]['isi_pesan'] + "</div>"
			                    "</div>" +
			                  "</a>" +
			                "</li>";
			                $$('#daftarkeluhan').append(str);
						}
					});
				}	
			}
		},
		{
			path: '/daftarkonfirmasichat/',
			url: 'daftarkonfirmasichat.html',
			on:{
				pageInit: function(e, page){
					app.panel.disableSwipe();
					username = localStorage.username;
					status = localStorage.kategori;
					tipehal = "konfirmasichat";
					localStorage.tipehal = tipehal;

					app.request.post(server + '/ecurhat/showlistkeluhan.php', {username, status, tipehal} , function(data){
					var obj = JSON.parse(data);
						for (var i = 0; i < obj.length; i++) {
							var str = 
							"<li>" +
			                  "<a href='/viewkeluhan/"+ obj[i]['id_keluhan'] +"' class='item-link item-content'>" +
			                    "<div class='item-inner'>" +
			                      "<div class='item-title-row'>" +
			                        "<div class='item-title'>"+ obj[i]['topik_pesan'] +"</div>" +
			                        "<div class='item-after'>"+ obj[i]['tanggal_diterima'] +"</div>" +
			                      "</div>" +
			                      "<div class='item-text'>" + obj[i]['isi_pesan'] + "</div>"
			                    "</div>" +
			                  "</a>" +
			                "</li>";
			                $$('#daftarkonfirmasi').append(str);
						}
					});
				}
			}
		},
		{
			path: '/viewkeluhan/:keluhanid',
			url: 'viewkeluhan.html',
			on:{
				pageInit: function(e, page){
					var id = page.router.currentRoute.params.keluhanid;
					tipe = localStorage.tipehal;
					username = localStorage.username;
					kategori = localStorage.kategori;
					// var welcome = "Selamat Datang " + '"' + username + '"' ;

					var keluhan = "<input type='hidden' name='keluhan_id' id='keluhan_id' value='"+ id +"'>";


					$$('#keluhan').html(keluhan);

					// app.dialog.alert(id);
					app.request.post(server + "/ecurhat/viewkeluhan.php?id="+id, {}, function(data){
					// app.dialog.alert(data);
					var obj = JSON.parse(data);
						for (var i = 0; i < obj.length; i++) {
							var datakeluhan =
							 "<input type='hidden' id='keluhan_id' name='keluhan_id' value='"+ id +"'>" +
							  "<div class='card-header'> <b>" + obj[i]['topik_pesan'] + "</b></div>" +
							  "<div class='card-content card-content-padding'>"+ 
								  "<p class='date'>"+ obj[i]['tanggal_diterima'] +"</p>" +
								  "<p>"+ obj[i]['isi_pesan'] +"</p>" +
							  "</div>";


							if( obj[i]['identitas_klien'] == 'anonymous'){
								var iden = 'Tanpa Nama';
							}
							else{
								var iden = obj[i]['nama_lengkap'];
							}

							//MELAPORKAN ORANG LAIN
							// if( obj[i]['identitas_klien'] == 'anonymous'){
							// 	var iden = 'Tanpa Nama';
							// }
							// else{
							// 	var iden = obj[i]['nama_lengkap'];
							// }

							var dataklien = 
							"<input type='hidden' id='idklien' name='idklien' value='"+ obj[i]['id_klien'] +"'>" +
							  "<div class='card-header'> <b> DATA KLIEN </b></div>" +
							  "<div class='card-content card-content-padding'>"+ 
								  "<p> Nama lengkap: "+ iden +"</p>" +
								  "<p> No. KTP: "+ obj[i]['no_ktp'] +"</p>" +
								  "<p> Jenis Kelamin: "+ obj[i]['jenis_kelamin'] +"</p>" +
								  "<p> Tanggal Lahir: "+ obj[i]['tanggal_lahir'] +"</p>" +
								  "<p> Alamat: "+ obj[i]['alamat'] +"</p>" +
								  "<p> No. Telp: "+ obj[i]['no_telp'] +"</p>" +
								  "<p> Email: "+ obj[i]['email'] +"</p>" +
							  "</div>";

							$$('#datakeluhan').html(datakeluhan);
							$$('#dataklien').html(dataklien);
						}
					});
					
					if(tipe === 'keluhanmasuk') {
						$$('#listkeluhan').html('<div class="left" di><a href="/daftarkeluhan/" class="link icon-only"><i class="icon f7-icons">chevron_left</i></a></div>');
						$$('#btnkrmkonselor').val('Kirim');
						$$('#judul').html('Keluhan Admin');
						if (kategori === 'admin'){
							$$('#kons').hide();
							app.request.post(server + "/ecurhat/konselor.php", {}, function(data){						
								var result = JSON.parse(data);
								// console.log(data);
								var combo1 = "<li class='item-content item-input'>" +
										"<div class='item-inner'>" +
					                      	"<div class='item-title item-label'>Staff yang menangani pengaduan</div>" +
						                    "<div class='item-input-wrap'>" +
						                        "<select id='selectpickerpegawai' name='selectpickerpegawai' placeholder='Mohon Pilih...' class='konselorkeluhan'>" +
						                        	"<option value=''>--------------------Pilih-------------------------------------------</option>" +
						                        "</select>"
											"</div>"
										"</div>"
									"</li>";
								$$('#adm').append(combo1);

								for (var i = 0; i < result.length; i++) {
									var str = "<option value='" + result[i]['idpegawai'] + "'>"+ result[i]['nama_pegawai'] + ", " + result[i]['jabatan'] +"</option>";
												
									$$('#selectpickerpegawai').append(str);
								}
							});

						}
						else if (kategori === 'konselor') {
							$$('#judul').html('Keluhan Konselor');
							$$('#adm').hide();

							// var ktgrikasus = $$('#kategorikasus').val();
							// var jkasus = $$('#jeniskasus').val();

							app.request.post(server + "/ecurhat/showjeniskasus.php", {}, function(data){						
								var result = JSON.parse(data);

								for (var i = 0; i < result.length; i++) {
									var str = "<option value='" + result[i]['idjenis_kasus'] + "'>"+ result[i]['jeniskasus'] + ", " + result[i]['jabatan'] +"</option>";
												
									$$('#jeniskasus').append(str);
								}
							});

							app.request.post(server + "/ecurhat/showdetilkasus.php", {}, function(data){						
								var result = JSON.parse(data);

								for (var i = 0; i < result.length; i++) {
									var str = "<option value='" + result[i]['iddetil_kasus'] + "'>"+ result[i]['detilkasus'] + ", " + result[i]['jabatan'] +"</option>";
												
									$$('#jeniskdrt').append(str);
								}
							});

							// $$('#jeniskasus').on('change', function(){
							// 	alert(jkasus);
							// 	if (jkasus == 'kdrt'){
							// 		$$('#jnskdrt').show();
							// 	}
							// 	else {
							// 		$$('#jnskdrt').hide();
							// 	}
							// });

							// if (ktgrikasus == 'kekerasan') {
							// 	$$('#jnskasus').show();
							// 	if (jkasus == 'kdrt'){
							// 		$$('#jnskdrt').show();
							// 	}
							// 	else {
							// 		$$('#jnskdrt').hide();
							// 	}
							// }
							// else{
							// 	$$('#jnskasus').hide();
							// }
						}
						$$('#listkeluhan').html('<div class="left" di><a href="/daftarkeluhan/" class="link icon-only"><i class="icon f7-icons">chevron_left</i></a></div>');
					}
					else if(tipe === 'konfirmasichat') {
						app.request.post(server + "/ecurhat/viewkeluhanwithpegawai.php?id="+id, {}, function(data){
							var obj = JSON.parse(data);
							for (var i = 0; i < obj.length; i++) {						
								var datakonselor = 
									"<input type='hidden' id='idpegawai' name='idpegawai' value='"+ obj[i]['idpegawai'] +"'>" +
									  "<div class='card-header'> <b> DATA PEGAWAI </b></div>" +
									  "<div class='card-content card-content-padding'>"+ 
										  "<p> Nama lengkap: "+ obj[i]['nama_pegawai'] +"</p>" +
										  "<p> Jenis Kelamin: "+ obj[i]['jenis_kelamin'] +"</p>" +
										  "<p> Tanggal Lahir: "+ obj[i]['tanggal_lahir'] +"</p>" +
										  "<p> Pendidikan Terakhir: "+ obj[i]['pendidikan_terakhir'] +"</p>" +
										  "<p> Jabatan: "+ obj[i]['jabatan'] +"</p>" +
									  "</div>";

								$$('#datakonselor').html(datakonselor);
							}
						});

						$$('#listkeluhan').html('<div class="left" di><a href="/daftarkonfirmasichat/" class="link icon-only"><i class="icon f7-icons">chevron_left</i></a></div>');
						$$('#judul').html('Daftar Konfirmasi Admin');
						$$('#btnkrmkonselor').val('Buatkan Chat');
						$$('#adm').hide();
						$$('#kons').hide();
					}

					$$('#btnkrmkonselor').on('click', function(){
						var x = new FormData($$('#view-keluhan')[0]);
						var prioritas = $$('#selectpickerprioritas').val();
						var penanggap = $$('#selectpickerpenanggap').val();
						// var bentuk = $$('#selectpickerbentuktanggapan').val();
						var pegawai = $$('#selectpickerpegawai').val();
						var masalah = $$('#selectpickermasalah').val();
						var keluhan_id = $$('#keluhan_id').val();

						if(tipe == 'keluhanmasuk'){
							if (kategori === 'admin') {
								if (penanggap != ''  && pegawai != '') {
									app.dialog.confirm('Apakah anda yakin ingin mengirim keluhan ini kepada konselor?', function () {
										
										app.request.post(server + '/ecurhat/updatekeluhan.php',
											{prioritas,penanggap,pegawai,masalah,keluhan_id, tipe,kategori}, function(data){
											var res = data;
											app.dialog.alert(res);
										});
										page.router.navigate('/daftarkeluhan/');;
									});
								}
								else{
									app.dialog.alert('Mohon lengkapi data sebelum dikirim ke konselor.');
								}
							}
							else if (kategori === 'konselor'){
								var nokk = $$('#nokk').val();
								var detilrumah = $$('#detilrumah').val();
								var detilsekolah = $$('#detilsekolah').val();
								var namaayah = $$('#namaayah').val();
								var namaibu = $$('#namaibu').val();
								var pekerjaanayah = $$('#pkrjnayah').val();
								var pekerjaanibu = $$('#pkrjnibu').val();
								var namasdr = $$('#namasdr').val();
								var kondisikeluarga = $$('#Kondisikeluarga').val();
								var detilpekerjaan = $$('#detilpekerjaan').val();
								var kepemilikanbpjs = $$('#kepemilikanbpjs').val();
								var kronologisPermasalahan = $$('#kronologisPermasalahan').val();
								var harapanklien = $$('#harapanklien').val();
								var jkdrt = $$('#jeniskdrt').val();
								var jkasus = $$('#jeniskasus').val();
								var detilrumah = $$('#detilrumah').val();
								//belum bisa upload foto

								if (nokk != '' ||  namaayah != '' || namaibu != '' || pekerjaanayah != '' || pekerjaanibu != '' || namasdr != '' || kondisikeluarga != '' ||
									detilpekerjaan != '' || detilsekolah != '' || kepemilikanbpjs != '' || harapanklien != '' || detilrumah != '') {
									// console.log(kategori, keluhan_id, tipe, nokk, alamatsklh, namaayah, namaibu, pekerjaanayah, pekerjaanibu, sdrkdg, sdrtiri, kondisikeluarga, ukuranrumah, jumlahruang, listrik, air, ktgrikasus,
									// 	jkasus, jkdrt);
									app.dialog.confirm('Apakah anda yakin ingin menyimpan data?', function () {
										app.request.post(server + '/ecurhat/updatekeluhan.php',
											{keluhan_id, tipe,kategori, nokk, detilsekolah, namaayah, namaibu, pekerjaanayah, pekerjaanibu, namasdr, kondisikeluarga, detilpekerjaan, kepemilikanbpjs, detilrumah, kronologisPermasalahan, harapanklien,
										jkasus, jkdrt}, function(data){
											var res = data;
											app.dialog.alert("Data Berhasil disimpan");
										});
										page.router.navigate('/daftarkeluhan/');
									});
								}
								else{
									app.dialog.alert('Mohon lengkapi data sebelum dikirim ke admin.');
								}
							}
						}
						else if (tipe === 'konfirmasichat'){
							app.dialog.confirm('Apakah anda yakin ingin membuatkan chat?', function () {
								app.request.post(server + '/ecurhat/updatekeluhan.php',
									{keluhan_id, tipe,kategori}, function(data){
									var res = data;
									app.dialog.alert(res);
								});
								page.router.navigate('/daftarkonfirmasichat/');
							});
						}
					}); 

					$$("#btnbtlkkrmkonselor").on('click', function(){
						app.dialog.confirm('Apakah anda yakin ingin membatalkan konfirmasi keluhan ini?', function () {
						    page.router.navigate('/daftarkeluhan/');
						  });
					});	
				}
			}
		},
		{
			path: '/listkategori/',
			url: 'listkategori.html',
			on:{
				pageInit: function(e, page){
					app.panel.disableSwipe();

					app.request.post(server + '/ecurhat/showjeniskasus.php', {}, function(data){
						var obj = JSON.parse(data);
						for (var i = 0; i < obj.length; i++) {
							var str = "<li>" + obj[i]['jeniskasus'] + "</li>";

							$$('#daftarkasus').append(str);
						}
					});
				},
			}
		},
		{
			path: '/tambahkategori/',
			url: 'tambahkategori.html',
			on:{
				pageInit: function(e, page){
					app.panel.disableSwipe();

					$$("#btnkrmkategori").on('click', function(){
						var x = new FormData($$('.kategori')[0]);
				       								
						app.request.post(server + '/ecurhat/insertkategori.php', 
						x, function(data){
							app.dialog.alert(data);
						
						});
					});
				},
			}
		},
		{
			path: '/pesan/',
			url: 'pesan.html',
			on:{
				pageInit: function(e, page){
					app.panel.disableSwipe();
					username = localStorage.username;
					status = localStorage.kategori;
					tipehal = 'pesan';
					localStorage.tipehal = tipehal;

					app.request.post(server + '/ecurhat/pesan.php',{username, status, tipehal}, function(data){
						var obj = JSON.parse(data);
						// console.log(data);
						for (var i = 0; i < obj.length; i++) {
							var idroom = obj[i]['id_keluhan'];
							var idpegawai = obj[i]['idpegawai'];
							var idklien = obj[i]['klien_id_klien'];
							var namaklien = obj[i]['nama_lengkap'];
							var namapegawai = obj[i]['nama_pegawai'];
							// console.log(namaklien);
							if (status == 'klien') {
								$$("#home").on('click', function(){
									page.router.navigate("/beranda/");
								});
								var chatting = 
								"<li> "+
            						"<a href='/chat/"+ idroom +"'class='item-link item-content'>" +
              							"<div class='item-inner'>" +
                							"<div class='item-title-row'" +
                  								"<div class='item-title'>Pesan dari "+ namapegawai +"</div>" +
               								"</div>" +
              							"</div>" +
            						"</a>"
          						"</li>";

          						$$("#msg").append(chatting);
							}

							if (status == 'konselor'){
								// $$("#beranda").html('<a href="/berandabackend/" class="tab-link" id="home">');
								$$("#home").on('click', function(){
									page.router.navigate("/berandabackend/");
								});
								var chatting = 
								"<li> "+
            						"<a href='/chat/"+ idroom +"' class='item-link item-content'>" +
              							"<div class='item-inner'>" +
                							"<div class='item-title-row'" +
                  								"<div class='item-title'>"+ namaklien +"</div>" +
               								"</div>" +
              							"</div>" +
            						"</a>"
          						"</li>";
          						$$("#msg").append(chatting);
							}							
						}
					});
				},
			}
		},
		{
			path: '/chat/:idroom',
			url: 'chat.html',
			on:{
				pageInit: function(e, page){
					app.panel.disableSwipe();
					var id = page.router.currentRoute.params.idroom;
					username = localStorage.username;
					status = localStorage.kategori;
					tipehal = 'chat';
					localStorage.tipehal = tipehal;
					var iduser;
					// $$("#sendchat").hide();

					app.request.post(server + '/ecurhat/pesanchat.php',{username, status, tipehal, id}, function(data){
						// console.log(data[0]['pegawai_idpegawai']);
						// console.log(data);
						var obj = JSON.parse(data);
						// page.router.refreshPage();
						for (var i = 0; i < obj.length; i++) {
							// var idroom = obj[i]['id_keluhan'];
							var idroom = id;
							var idpegawai = obj[i]['pegawai_idpegawai'];
							var idklien = obj[i]['klien_id_klien'];
							var namaklien = obj[i]['nama_lengkap'];
							var namapegawai = obj[i]['nama_pegawai'];

							if (status == 'klien') {
								iduser = idpegawai;
									app.request.post(server + '/ecurhat/readchat.php',{status,idpegawai,idroom,idklien},function(data){
										var objct = JSON.parse(data);
										// console.log(data);
										// var sndmsg;
										for (var i = 0; i < objct.length; i++) {
											if(objct[i]['keterangan'] == status){
												var sndmsg = 
													'<div class="message message-sent">' +
												      '<div class="message-content">' +
											        	'<div class="message-name">Blue Ninja</div>' +
											          		'<div class="message-bubble">' +
											            		'<div class="message-text">'+ objct[i]['isi_chat']+' </div>' +
											          		'</div>' +
											        	'</div>' +
											        '</div>';
										        	$$("#chats").append(sndmsg);
											}
											else{
												var sndmsg = 
												'<div class="message message-received">' +
											        '<div class="message-content">' +
											          '<div class="message-name">Blue Ninja</div>' +
											          '<div class="message-bubble">' +
											            '<div class="message-text"> '+ objct[i]['isi_chat'] +' </div>' +
											          '</div>'
											        '</div>'
											      '</div>';
											      $$("#chats").append(sndmsg);
											}
											

										    $$("#namakontak").html(namapegawai);
								   		}
									});
									// setTimeout(function () {
								 //    	page.router.refreshPage();
								 //  	}, 6000);
							}

							if (status == 'konselor'){
								iduser = idklien;
								app.request.post(server + '/ecurhat/readchat.php',{status,idpegawai,idroom,idklien},function(data){
									var objct = JSON.parse(data);
									// console.log(idpegawai);
									for (var i = 0; i < objct.length; i++) {
										// console.log(objct[i]['keterangan']);
										// console.log(data);
										if(objct[i]['keterangan'] == status){
											var sndmsg = 
												'<div class="message message-sent">' +
											      '<div class="message-content">' +
										        	'<div class="message-name">Blue Ninja</div>' +
										          		'<div class="message-bubble">' +
										            		'<div class="message-text">'+ objct[i]['isi_chat']+' </div>' +
										          		'</div>' +
										        	'</div>' +
										        '</div>';
									        	$$("#chats").append(sndmsg);
										}
										else{
											var sndmsg1 = 
											'<div class="message message-received">' +
										        '<div class="message-content">' +
										          '<div class="message-name">Blue Ninja</div>' +
										          '<div class="message-bubble">' +
										            '<div class="message-text"> '+ objct[i]['isi_chat'] +' </div>' +
										          '</div>'
										        '</div>'
										      '</div>';
										      $$("#chats").append(sndmsg1);
										}
										// console.log(obj);
									    $$("#namakontak").html(namaklien);
								   		// $$("#receivedchat").append(sndmsg);

								   	// 	var msgsndr =
								    //     	'<div class="message-content">' +
								    //     	'<div class="message-name">Blue Ninja</div>' +
								    //       		'<div class="message-bubble">' +
								    //         		'<div class="message-text">'+ objct[i]['chatsender'] +' </div>' +
								    //       		'</div>' +
								    //     	'</div>';

									   // $$("#sendchat").append(msgsndr);
							   		}
								});
								// setTimeout(function () {
							 //    	page.router.refreshPage();
							 //  	}, 6000);
							}
						}
					});
					

					$$("#btnkrmpesan").on('click', function(){
						var teks = $$("#msgtxt").val();
				       	// app.dialog.alert(teks);	
				       						
						app.request.post(server + '/ecurhat/sendchat.php',{username, status,teks,id}, function(data){
							 
						    	page.router.refreshPage();
						  	
							// // console.log(data);
							// // if(data == 'berhasil'){
							// 	// app.dialog.alert(teks);
							// 	var sndmsg =
						 //        	'<div class="message-content">' +
						 //        	'<div class="message-name">Blue Ninja</div>' +
						 //          		'<div class="message-bubble">' +
						 //            		'<div class="message-text">'+ teks+' </div>' +
						 //          		'</div>' +
						 //        	'</div>';

							//    $$("#sendchat").append(sndmsg);
							// // }
						});
					});

					$$("#call").on('click', function(){
						if (status == 'konselor') {
							app.request.post(server + '/ecurhat/shownotelp.php',{status,iduser},function(data){
								var objct = JSON.parse(data);
								$$(document).on('deviceready', function() {
									function onSuccess(result){
									  console.log("Success:"+result);
									}
									 
									function onError(result) {
									  console.log("Error:"+result);
									}
									window.plugins.CallNumber.callNumber(onSuccess, onError, objct[0]["no_telp"]);
								 //  console.log('cordova.plugins.CordovaCall is now available');
								 //  // var cordovaCall = cordova.plugins.CordovaCall;
								 //  cordova.plugins.CordovaCall.sendCall('Thusa');
		 
									// //simulate your friend answering the call 5 seconds after you call
									// setTimeout(function(){
									//   cordova.plugins.CordovaCall.connectCall();
									// }, 5000);   
								});
							});
						}
						else if (status == 'klien'){
							app.request.post(server + '/ecurhat/shownotelp.php',{status,iduser},function(data){
								var objct = JSON.parse(data);
								$$(document).on('deviceready', function() {
									function onSuccess(result){
									  console.log("Success:"+result);
									}
									 
									function onError(result) {
									  console.log("Error:"+result);
									}
									window.plugins.CallNumber.callNumber(onSuccess, onError, objct[0]["notelp"]);
								 //  console.log('cordova.plugins.CordovaCall is now available');
								 //  // var cordovaCall = cordova.plugins.CordovaCall;
								 //  cordova.plugins.CordovaCall.sendCall('Thusa');
		 
									// //simulate your friend answering the call 5 seconds after you call
									// setTimeout(function(){
									//   cordova.plugins.CordovaCall.connectCall();
									// }, 5000);   
								});
							});
						}


						
					})
					$$("#videocall").on('click', function(){
						$$(document).on('deviceready', function() {
							window.open = cordova.InAppBrowser.open;
							var ref = cordova.InAppBrowser.open('https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=13&ct=1563387088&rver=7.1.6819.0&wp=MBI_SSL&wreply=https%3A%2F%2Flw.skype.com%2Flogin%2Foauth%2Fproxy%3Fclient_id%3D572381%26redirect_uri%3Dhttps%253A%252F%252Fweb.skype.com%252FAuth%252FPostHandler%26state%3D80dee5c8-0eb5-4316-9839-b94424852536%26site_name%3Dlw.skype.com&lc=1033&id=293290&mkt=id-ID&psi=skype&lw=1&cobrandid=2befc4b5-19e3-46e8-8347-77317a16a5a5&client_flight=ReservedFlight33%2CReservedFlight67', '_blank', 'location=yes');
						});
					})
				},
			}
		},
		{
			path: '/daftarprogress/',
			url: 'daftarprogress.html',
			on:{
				pageInit: function(e, page){
					app.panel.disableSwipe();
					username = localStorage.username;
					status = localStorage.kategori;
					tipehal = "daftarprogress";
					localStorage.tipehal = tipehal;				

					app.request.post(server + '/ecurhat/showlistkeluhan.php', {username, status, tipehal} , function(data){
					var obj = JSON.parse(data);
						for (var i = 0; i < obj.length; i++) {
							var str = 
							"<li>" +
			                  "<a href='/progresskeluhan/"+ obj[i]['id_keluhan'] +"' class='item-link item-content'>" +
			                    "<div class='item-inner'>" +
			                      "<div class='item-title-row'>" +
			                        "<div class='item-title'>"+ obj[i]['topik_pesan'] +"</div>" +
			                        "<div class='item-after'>"+ obj[i]['tanggal_diterima'] +"</div>" +
			                      "</div>" +
			                      "<div class='item-text'>" + obj[i]['isi_pesan'] + "</div>"
			                    "</div>" +
			                  "</a>" +
			                "</li>";

			                var bntkkonsul = "<input type='hidden' name='bentuk_konsul' id='bentuk_konsul' value='"+ obj[i]['bentuk_tanggapan'] +"'>";

			                $$('#daftarprogress').append(str);

						}
					});

					if (status == 'konselor') {
						
						// $$('btn').show();

						app.request.post(server + "/ecurhat/showjeniskasus.php", {}, function(data){						
							var result = JSON.parse(data);

							var kk = "<li class='item-content item-input'>" + 
					                    "<div class='item-inner'>" +
					                      "<div class='item-title item-label'>Pilih Kasus</div>" +
					                      "<div class='item-input-wrap'>" +
					                        "<select placeholder='Mohon Pilih...'' required validate id='jeniskasus' name='jeniskasus'>" +
					                          "<option value=''>----------------------------Pilih---------------------------------</option>" +
					                        "</select>" +
					                      "</div>" +
					                    "</div>" +
					                  "</li>";
					        $$('#kategorikasus').html(kk);

							for (var i = 0; i < result.length; i++) {
								var str ="<option value='" + result[i]['idjenis_kasus'] + "'>"+ result[i]['jeniskasus'] + "</option>";
											
								$$('#jeniskasus').append(str);
							}
						});

						var btn = "<input type='button' name='btntampilkan' id='btntampilkan' value='Tampilkan Laporan' class='col button button-fill color-green'>";
						$$('#btn').html(btn);

						$$('#btntampilkan').on('click', function(){
							var kasus = $$('#jeniskasus').val();
							app.request.post(server + "/ecurhat/showlistwithkategori.php", {username, status, tipehal, kasus}, function(data){
								var obj = JSON.parse(data);
								for (var i = 0; i < obj.length; i++) {
									var str = 
									"<li>" +
					                  "<a href='/progresskeluhan/"+ obj[i]['id_keluhan'] +"' class='item-link item-content'>" +
					                    "<div class='item-inner'>" +
					                      "<div class='item-title-row'>" +
					                        "<div class='item-title'>"+ obj[i]['topik_pesan'] +"</div>" +
					                        "<div class='item-after'>"+ obj[i]['tanggal_diterima'] +"</div>" +
					                      "</div>" +
					                      "<div class='item-text'>" + obj[i]['isi_pesan'] + "</div>"
					                    "</div>" +
					                  "</a>" +
					                "</li>";
					                $$('#daftarkeluhan').append(str);
					                $$('#daftarprogress').hide();
								}
							});						
						});
					}
				},
			}
		},
		{
			path: '/progresskeluhan/:idkeluhan',
			url: 'progresskeluhan.html',
			on:{
				pageInit: function(e, page){
					app.panel.disableSwipe();
					var id = page.router.currentRoute.params.idkeluhan;
					tipehal = 'progresskeluhan';
					localStorage.tipehal = tipehal;
					username = localStorage.username;
					kategori = localStorage.kategori;
					$$('#listkeluhan').html('<div class="left" di><a href="/daftarprogress/" class="link icon-only"><i class="icon f7-icons">chevron_left</i></a></div>');
					$$('#judul').html('Detail Progress');

					app.request.post(server + "/ecurhat/viewkeluhanwithkasus.php?id="+id, {} , function(data){
						var obj = JSON.parse(data);
						for (var i = 0; i < obj.length; i++) {
							var str = "<input type='hidden' id='idkeluhan' name='idkeluhan' value='"+ id +"'>" +
							  "<div class='card-content card-content-padding'>"+ 
								  "<p> Nama Klien: "+ obj[i]['nama_lengkap'] +"</p>" +
								  "<p> Topik Keluhan: "+ obj[i]['topik_pesan'] +"</p>" +
								  "<p> Jenis Kasus: "+ obj[i]['jeniskasus'] +"</p>" +
							  "</div>";

							$$('#datakeluhan').append(str);
						}
					});

					// app.dialog.alert(id);
					$$('#btnkrmprogress').on('click', function(){
						var isikonsul = $$('isi_konsultasi').val();
						var kondisiklien = $$('kondisiklien').val();
						var tempatkonsul = $$('isi_konsultasi').val();


						if (isikonsul != ''  && kondisiklien != '' && tempatkonsul != '' ) {
							var x = new FormData($$('.progresskeluhan')[0]);
							app.request.post(server + '/ecurhat/insertprogress.php',x,function(data){
								app.dialog.alert("Data Berhasil Disimpan!");
							});
						}
						else{
							app.dialog.alert('Mohon lengkapi data konsultasi klien');
						}
					});
				},
			}
		},
		{
			path: '/laporankonselor/',
			url: 'laporankonselor.html',
			on: {
				pageInit: function(e, page){
					app.request.post(server + "/ecurhat/showjeniskasus.php", {}, function(data){						
						var result = JSON.parse(data);

						for (var i = 0; i < result.length; i++) {
							var str = "<option value='" + result[i]['idjenis_kasus'] + "'>"+ result[i]['jeniskasus'] + "</option>";
										
							$$('#jeniskasus').append(str);
						}
					});


					$$('#btntampilkan').on('click', function(){
						var bln = $$('#bulan').val();
						var thn = $$('#tahun').val();
						var statuskonsul = $$('#statuskonsul').val();
						var jkasus = $$('#jeniskasus').val();

						app.request.post(server + "/ecurhat/showlaporankons.php", {bln,thn,statuskonsul,jkasus}, function(data){						
							var res = JSON.parse(data);
							console.log(data);

							for (var i = 0; i < res.length; i++) {
								var datakel = "<li>" +
								                  "<a href='/viewlaporankonselor/"+ res[i]['id_keluhan'] +"' class='item-link item-content'>" +
								                    "<div class='item-inner'>" +
								                      "<div class='item-title-row'>" +
								                        "<div class='item-title'> Judul Keluhan: "+ res[i]['topik_pesan'] +"</div>" +
								                      "</div>" +
								                      "<div class='item-text'>Tanggal Keluhan Masuk: " + res[i]['tanggal_diterima'] +" ,Status Konsultasi:" + res[i]['status'] + " ,  Jenis Kasus: "+ res[i]['jeniskasus'] +" </div>"
								                    "</div>" +
								                  "</a>" +
								                "</li>";
								$$('#datakeluhan').append(datakel);
							}
						});
					});

					$$('#btnclear').on('click', function(){
						var bln = $$('#bulan').val(' ');
						var thn = $$('#tahun').val(' ');
						var statuskonsul = $$('#statuskonsul').val(' ');
						var jkasus = $$('#jeniskasus').val(' ');

						$$('#datakeluhan').html(' ');
					});
				}
			}
		},
		{
			path: '/viewlaporankonselor/:idkeluhan',
			url: 'viewlaporankonselor.html',
			on:{
				pageInit: function(e, page){
					var id = page.router.currentRoute.params.idkeluhan;

					app.request.post(server + "/ecurhat/viewkeluhan.php?id="+id, {}, function(data){						
						var res = JSON.parse(data);

						for (var i = 0; i < res.length; i++) {
							var datakel = 
							"<div class='card-header'> <b>" + res[i]['topik_pesan'] + "</b></div>" +
						  	"<div class='card-content card-content-padding'>"+ 
							  "<p class='date'>"+ res[i]['tanggal_diterima'] +"</p>" +
							  "<p>"+ res[i]['isi_pesan'] +"</p>" +
						  	"</div>";

							$$('#data_keluhan').append(datakel);

							if( res[i]['identitas_klien'] == 'anonymous'){
							var iden = 'Tanpa Nama';
							}
							else{
								var iden = res[i]['nama_lengkap'];
							}

							var dataklien = 
							"<input type='hidden' id='idklien' name='idklien' value='"+ res[i]['id_klien'] +"'>" +
							  "<div class='card-header'> <b> DATA KLIEN </b></div>" +
							  "<div class='card-content card-content-padding'>"+ 
								  "<p> Nama lengkap: "+ iden +"</p>" +
								  "<p> No. KTP: "+ res[i]['no_ktp'] +"</p>" +
								  "<p> Jenis Kelamin: "+ res[i]['jenis_kelamin'] +"</p>" +
								  "<p> Tanggal Lahir: "+ res[i]['tanggal_lahir'] +"</p>" +
								  "<p> Alamat: "+ res[i]['alamat'] +"</p>" +
								  "<p> No. Telp: "+ res[i]['no_telp'] +"</p>" +
								  "<p> Email: "+ res[i]['email'] +"</p>" +
							  "</div>";
							
							$$('#dataklien').append(dataklien);
						}
					});


					app.request.post(server + "/ecurhat/viewkeluhanwithkonsultasi.php?id="+id, {}, function(data){
						var obj =JSON.parse(data);

						var datakasus = 
							"<div class='card-header'> <b>Jenis Kasus</b></div>" +
						  	"<div class='card-content card-content-padding'>"+ 
							  "<p> Nama Kasus: "+ obj[0]['jeniskasus'] +"</p>" +
						  	"</div>";

							$$('#jkasus').append(datakasus);
						for (var i = 0; i < obj.length; i++) {
							

							var datakonsul = 
							  "<div class='card-header'> <b> DATA Konsultasi </b></div>" +
							  "<div class='card-content card-content-padding'>"+ 
								  "<p> Isi Konsultasi: "+ obj[i]['isi_konsultasi'] +"</p>" +
								  "<p> Progress Klien: "+ obj[i]['progress_klien'] +"</p>" +
								  "<p> Tanggal Konsultasi: "+ obj[i]['tanggal_konsultasi'] +"</p>" +
								  "<p> Tempat Konsultasi : "+ obj[i]['tempat_konsul'] +"</p>" +
								  "<p> Status Konsultasi: "+ obj[i]['status'] +"</p>" +
							  "</div>";
							
							$$('#datakonsul').append(datakonsul);

						}
					});
				}
			}
		},
		{
			path: '/profil/',
			url: 'profil.html',
			on:{
				pageInit: function(e, page){
					username = localStorage.username;
					kategori = localStorage.kategori;

					if (kategori == 'klien') {
						$$("#home").on('click', function(){
							page.router.navigate("/beranda/");
						});
					}

					if (kategori == 'konselor') {
						$$('#klien').hide();
						$$("#home").on('click', function(){
							page.router.navigate("/berandabackend/");
						});
					}
					if (kategori == 'admin') {
						$$('#klien').hide();
						$$("#home").on('click', function(){
							page.router.navigate("/berandabackend/");
						});
					}
				},
			}
		},
		{
			path: '/editprofil/',
			url: 'editprofil.html',
			on:{
				pageInit: function(e, page){
					app.panel.disableSwipe();
					username = localStorage.username;
					status = localStorage.kategori;

					if (status == 'klien'){
						$$('#kons').hide();
						$$('#edit').hide();
						$$('#btnhide').hide();
						app.request.post(server + '/ecurhat/showkecamatan.php', {}, function(data){
							var result = JSON.parse(data);
								for (var i = 0; i < result.length; i++) {
									var str = "<option value='" + result[i]['idkecamatan'] + "'>"+ result[i]['nama_kecamatan'] +"</option>";
												
									$$('#pickerkecamatan').append(str);
								}
						});

						app.request.post(server + '/ecurhat/showkelurahan.php', {}, function(data){
							var result = JSON.parse(data);
								for (var i = 0; i < result.length; i++) {

									var stri = "<option value='" + result[i]['idkelurahan'] + "'>"+ result[i]['namakelurahan'] +"</option>";
												
									$$('#pickerkelurahan').append(stri);
								}
						});

						app.request.post(server + '/ecurhat/showdatauser.php', {username, status}, function(data){
							var result = JSON.parse(data);
							for (var i = 0; i < result.length; i++) {

								var dataklien = 
									"<input type='hidden' id='idklien' name='idklien' value='"+ result[i]['id_klien'] +"'>" +
									  "<div class='card-header'> <b> Data Pengguna </b></div>" +
									  "<div class='card-content card-content-padding'>"+ 
										  "<p> Nama lengkap: "+ result[i]['nama_lengkap'] +"</p>" +
										  "<p> No. KTP: "+ result[i]['no_ktp'] +"</p>" +
										  "<p> Jenis Kelamin: "+ result[i]['jenis_kelamin'] +"</p>" +
										  "<p> Tanggal Lahir: "+ result[i]['tanggal_lahir'] +"</p>" +
										  "<p> Alamat: "+ result[i]['alamat'] +"</p>" +
										  "<p> No. Telp: "+ result[i]['no_telp'] +"</p>" +
										  "<p> Email: "+ result[i]['email'] +"</p>" +
									  "</div>";
											
								$$('#data_user').append(dataklien);
							}
						});
					}
					if (status == 'konselor'){
						$$('#edit').hide();
						$$('#btnhide').hide();
						$$('#ktpno').hide();
						$$('#job').hide();
						$$('#address').hide();
						$$('#kec').hide();
						$$('#kel').hide();
						$$('#em').hide();

						app.request.post(server + '/ecurhat/showdatauser.php', {username, status}, function(data){
							var result = JSON.parse(data);
							for (var i = 0; i < result.length; i++) {

								var datakonselor = 
								"<input type='hidden' id='idpegawai' name='idpegawai' value='"+ result[i]['idpegawai'] +"'>" +
								  "<div class='card-header'> <b> Data Pengguna </b></div>" +
								  "<div class='card-content card-content-padding'>"+ 
									  "<p> Nama lengkap: "+ result[i]['nama_pegawai'] +"</p>" +
									  "<p> Jenis Kelamin: "+ result[i]['jenis_kelamin'] +"</p>" +
									  "<p> Tanggal Lahir: "+ result[i]['tanggal_lahir'] +"</p>" +
									  "<p> Pendidikan Terakhir: "+ result[i]['pendidikan_terakhir'] +"</p>" +
									  "<p> Jabatan: "+ result[i]['jabatan'] +"</p>" +
								  "</div>";

							$$('#datauser').html(datakonselor);
							}
						});
					}
					if (status == 'admin'){
						$$('#edit').hide();
						$$('#btnhide').hide();
						$$('#usern').hide();
						$$('#namal').hide();
						$$('#ktpno').hide();
						$$('#jk').hide();
						$$('#job').hide();
						$$('#tgllahir').hide();
						$$('#address').hide();
						$$('#kec').hide();
						$$('#kel').hide();
						$$('#kons').hide();
						$$('#number').hide();
						$$('#em').hide();

						app.request.post(server + '/ecurhat/showdatauser.php', {username, status}, function(data){
							var result = JSON.parse(data);
								for (var i = 0; i < result.length; i++) {

									var dataadmin = 
									"<input type='hidden' id='usernm' name='usernm' value='"+ result[i]['username'] +"'>" +
									  "<div class='card-header'> <b> Data Pengguna </b></div>" +
									  "<div class='card-content card-content-padding'>"+ 
										  "<p> Nama Pengguna: "+ result[i]['username'] +"</p>" +
										  "<p> Password : "+ result[i]['password'] +"</p>" +
									  "</div>";

								$$('#datauser').html(dataadmin);
								}
						});
					}

					$$('#btnedt').on('click', function(){
						$$('#edit').show();
						$$('#btnhide').show();
						$$('#btnedt').hide();
					});
				}
			}
		},
		{
			path: '/notifikasi/',
			url: 'notifikasi.html',
			on:{
				pageInit: function(e, page){
					app.panel.disableSwipe();
					$$('#btnBatal').on('click', function(){
						page.router.navigate('/profil/');
					});
				}
			}
		},
		{
			path: '/listvalmasuk/',
			url: 'listvallaporanmasuk.html',
			on:{
				pageInit: function(e, page){
					app.panel.disableSwipe();
					var us = localStorage.username;
					localStorage.valstatus = 'valmasuk';

					if (us == 'walikota') {
						$$('#listacc').hide();
					}
				}
			}
		},
		{
			path: '/listvalakhir/',
			url: 'listvallaporanakhir.html',
			on:{
				pageInit: function(e, page){
					app.panel.disableSwipe();
					var us = localStorage.username;
					localStorage.valstatus = 'valakhir';

					if (us == 'walikota') {
						$$('#listacc').hide();
					}
				}
			}
		},
		{
			path: '/listvalacc/',
			url: 'listvallaporanacc.html',
			on:{
				pageInit: function(e, page){
					app.panel.disableSwipe();
					var us = localStorage.username;
					var status = localStorage.valstatus;
					console.log(status);

					if(us == 'kasie' || us=='kabid' || us=='kadis' || us == 'walikota'){
						app.request.post(server + '/ecurhat/showlistvalacc.php', {us,status} , function(data){
							var obj = JSON.parse(data);
							for (var i = 0; i < obj.length; i++) {
								var str = 
								"<li>" +
				                  "<a href='/viewlaporanacc/"+ obj[i]['id_keluhan'] +"' class='item-link item-content'>" +
				                    "<div class='item-inner'>" +
				                      "<div class='item-title-row'>" +
				                        "<div class='item-title'>"+ obj[i]['topik_pesan'] +"</div>" +
				                        "<div class='item-after'>"+ obj[i]['tanggal_diterima'] +"</div>" +
				                      "</div>" +
				                      "<div class='item-text'>" + obj[i]['isi_pesan'] + "</div>"
				                    "</div>" +
				                  "</a>" +
				                "</li>";
				                $$('#datakeluhan').append(str);
							}
						});
					}
				}
			}
		},
		{
			path: '/listvalblmacc/',
			url: 'listvallaporanblmacc.html',
			on:{
				pageInit: function(e, page){
					var us = localStorage.username;
					var status = localStorage.valstatus;

					if(us == 'kasie' || us=='kabid' || us=='kadis' || us == 'walikota'){
						app.request.post(server + '/ecurhat/showlistvalblmacc.php', {us, status} , function(data){
							var obj = JSON.parse(data);
							for (var i = 0; i < obj.length; i++) {
								var str = 
								"<li>" +
				                  "<a href='/viewlaporanblmacc/"+ obj[i]['id_keluhan'] +"' class='item-link item-content'>" +
				                    "<div class='item-inner'>" +
				                      "<div class='item-title-row'>" +
				                        "<div class='item-title'>"+ obj[i]['topik_pesan'] +"</div>" +
				                        "<div class='item-after'>"+ obj[i]['tanggal_diterima'] +"</div>" +
				                      "</div>" +
				                      "<div class='item-text'>" + obj[i]['isi_pesan'] + "</div>"
				                    "</div>" +
				                  "</a>" +
				                "</li>";
				                $$('#datakeluhan').append(str);
							}
						});
					}
				}
			}
		},
		{
			path: '/viewlaporanblmacc/:idkeluhan',
			url: 'viewlaporanblmacc.html',
			on:{
				pageInit: function(e, page){
					var id = page.router.currentRoute.params.idkeluhan;
					var us = localStorage.username;
					var status = localStorage.valstatus;

					app.request.post(server + "/ecurhat/viewkeluhan.php?id="+id, {}, function(data){						
						var res = JSON.parse(data);

						for (var i = 0; i < res.length; i++) {
							var datakel = 
							"<div class='card-header'> <b>" + res[i]['topik_pesan'] + "</b></div>" +
						  	"<div class='card-content card-content-padding'>"+ 
							  "<p class='date'>"+ res[i]['tanggal_diterima'] +"</p>" +
							  "<p>"+ res[i]['isi_pesan'] +"</p>" +
						  	"</div>";

							$$('#data_keluhan').append(datakel);

							if( res[i]['identitas_klien'] == 'anonymous'){
							var iden = 'Tanpa Nama';
							}
							else{
								var iden = res[i]['nama_lengkap'];
							}

							var dataklien = 
							"<input type='hidden' id='idklien' name='idklien' value='"+ res[i]['id_klien'] +"'>" +
							  "<div class='card-header'> <b> DATA KLIEN </b></div>" +
							  "<div class='card-content card-content-padding'>"+ 
								  "<p> Nama lengkap: "+ iden +"</p>" +
								  "<p> No. KTP: "+ res[i]['no_ktp'] +"</p>" +
								  "<p> Jenis Kelamin: "+ res[i]['jenis_kelamin'] +"</p>" +
								  "<p> Tanggal Lahir: "+ res[i]['tanggal_lahir'] +"</p>" +
								  "<p> Alamat: "+ res[i]['alamat'] +"</p>" +
								  "<p> No. Telp: "+ res[i]['no_telp'] +"</p>" +
								  "<p> Email: "+ res[i]['email'] +"</p>" +
							  "</div>";
							
							$$('#dataklien').append(dataklien);

							var dataket = "<div class='card-header'> <b> Keterangan dari Pimpinan Sebelumnya</b></div>" + 
						                    "<div class='card-content card-content-padding'>" + 
						                      "<p>"+ res[i]['keterangan'] +"</p>" +
						                   "</div>"; 
						    $$('#dataketerangan').append(dataket);  
						}
					});

					app.request.post(server + "/ecurhat/showdatadetilklien.php", {us,status,id}, function(data){
						var res = JSON.parse(data);
						for (var i = 0; i < res.length; i++) {
							var datadetail = 
							  "<div class='card-header'> <b> DATA TAMBAHAN KLIEN </b></div>" +
							  "<div class='card-content card-content-padding'>"+ 
								  "<p> Nama Ayah: "+ res[i]['nama_ayah'] +"</p>" +
								  "<p>Nama Ibu: "+ res[i]['nama_ibu'] +"</p>" +
								  "<p> Pekerjaan Ayah: "+ res[i]['pekerjaan_ayah'] +"</p>" +
								  "<p> Pekerjaan Ibu: "+ res[i]['pekerjaan_ibu'] +"</p>" +
								  "<p> Nama Saudara: "+ res[i]['namasaudara'] +"</p>" +
								  "<p> Situasi Keluarga klien: "+ res[i]['kondisi_keluarga'] +"</p>" +
								  "<p> etil Tempat Tinggal Klien: "+ res[i]['detil_tempattinggal'] +"</p>" +
								  "<p> Detil Pekerjaan Klien: "+ res[i]['detil_pekerjaan'] +" </p>"
				                  "<p> Detil Sekolah: "+ res[i]['detil_sekolah'] +" </p>"
				                  "<p> Kepemilikan BPJS: "+ res[i]['detil_bpjs'] +" </p>"
				                  "<p> Kronologis Permasalahan: "+ res[i]['kronologis_permasalahan'] +" </p>"
				                  "<p> Harapan Klien: "+ res[i]['harapan_klien'] +"</p>"
				                  "<p> Jenis Kasus: "+ res[i]['jeniskasus'] +"</p>"
							  "</div>";
							
							$$('#datadetail').append(datadetail);
						}
					});

					if (us == 'kasie') {
						$$('#dataketerangan').hide();
					}

					$$('#btnsetuju').on('click', function(){

						var ket = $$('#keterangan').val();
						app.request.post(server + "/ecurhat/updatevalblmacc.php", {us,status, ket, id}, function(data){
							app.dialog.alert(data);
						});
					});

				}
			}
		},
		{
			path: '/viewlaporanacc/:idkeluhan',
			url: 'viewlaporanacc.html',
			on:{
				pageInit: function(e, page){
					var id = page.router.currentRoute.params.idkeluhan;
					var us = localStorage.username;
					var status = localStorage.valstatus;

					app.request.post(server + "/ecurhat/viewkeluhan.php?id="+id, {}, function(data){						
						var res = JSON.parse(data);

						for (var i = 0; i < res.length; i++) {
							var datakel = 
							"<div class='card-header'> <b>" + res[i]['topik_pesan'] + "</b></div>" +
						  	"<div class='card-content card-content-padding'>"+ 
							  "<p class='date'>"+ res[i]['tanggal_diterima'] +"</p>" +
							  "<p>"+ res[i]['isi_pesan'] +"</p>" +
						  	"</div>";

							$$('#data_keluhan').append(datakel);

							if( res[i]['identitas_klien'] == 'anonymous'){
							var iden = 'Tanpa Nama';
							}
							else{
								var iden = res[i]['nama_lengkap'];
							}

							var dataklien = 
							"<input type='hidden' id='idklien' name='idklien' value='"+ res[i]['id_klien'] +"'>" +
							  "<div class='card-header'> <b> DATA KLIEN </b></div>" +
							  "<div class='card-content card-content-padding'>"+ 
								  "<p> Nama lengkap: "+ iden +"</p>" +
								  "<p> No. KTP: "+ res[i]['no_ktp'] +"</p>" +
								  "<p> Jenis Kelamin: "+ res[i]['jenis_kelamin'] +"</p>" +
								  "<p> Tanggal Lahir: "+ res[i]['tanggal_lahir'] +"</p>" +
								  "<p> Alamat: "+ res[i]['alamat'] +"</p>" +
								  "<p> No. Telp: "+ res[i]['no_telp'] +"</p>" +
								  "<p> Email: "+ res[i]['email'] +"</p>" +
							  "</div>";
							
							$$('#dataklien').append(dataklien);

							var dataket = "<div class='card-header'> <b> Keterangan dari Pimpinan Sebelumnya</b></div>" + 
						                    "<div class='card-content card-content-padding'>" + 
						                      "<p>"+ res[i]['keterangan'] +"</p>" +
						                   "</div>"; 
						    $$('#dataketerangan').append(dataket);
						}
					});

					app.request.post(server + "/ecurhat/showdatadetilklien.php", {us,status,id}, function(data){
						var res = JSON.parse(data);
						for (var i = 0; i < res.length; i++) {
							var datadetail = 
							  "<div class='card-header'> <b> DATA TAMBAHAN KLIEN </b></div>" +
							  "<div class='card-content card-content-padding'>"+ 
								  "<p> Nama Ayah: "+ res[i]['nama_ayah'] +"</p>" +
								  "<p>Nama Ibu: "+ res[i]['nama_ibu'] +"</p>" +
								  "<p> Pekerjaan Ayah: "+ res[i]['pekerjaan_ayah'] +"</p>" +
								  "<p> Pekerjaan Ibu: "+ res[i]['pekerjaan_ibu'] +"</p>" +
								  "<p> Nama Saudara: "+ res[i]['namasaudara'] +"</p>" +
								  "<p> Situasi Keluarga klien: "+ res[i]['kondisi_keluarga'] +"</p>" +
								  "<p> etil Tempat Tinggal Klien: "+ res[i]['detil_tempattinggal'] +"</p>" +
								  "<p> Detil Pekerjaan Klien: "+ res[i]['detil_pekerjaan'] +" </p>"
				                  "<p> Detil Sekolah: "+ res[i]['detil_sekolah'] +" </p>"
				                  "<p> Kepemilikan BPJS: "+ res[i]['detil_bpjs'] +" </p>"
				                  "<p> Kronologis Permasalahan: "+ res[i]['kronologis_permasalahan'] +" </p>"
				                  "<p> Harapan Klien: "+ res[i]['harapan_klien'] +"</p>"
				                  "<p> Jenis Kasus: "+ res[i]['jeniskasus'] +"</p>"
							  "</div>";
							
							$$('#datadetail').append(datadetail);
						}
					});

					if(username == 'kasie'){
						if (status == 'valakhir') {
							$$('#adm').hide();
						}
						else{
							app.request.post(server + "/ecurhat/konselor.php", {}, function(data){						
									var result = JSON.parse(data);
									// console.log(data);
									var combo1 = "<li class='item-content item-input'>" +
											"<div class='item-inner'>" +
						                      	"<div class='item-title item-label'>Staff yang menangani pengaduan</div>" +
							                    "<div class='item-input-wrap'>" +
							                        "<select id='selectpickerpegawai' name='selectpickerpegawai' placeholder='Mohon Pilih...' class='konselorkeluhan'>" +
							                        	"<option value=''>--------------------Pilih-------------------------------------------</option>" +
							                        "</select>"
												"</div>"
											"</div>"
										"</li>";
									$$('#adm').append(combo1);

									for (var i = 0; i < result.length; i++) {
										var str = "<option value='" + result[i]['idpegawai'] + "'>"+ result[i]['nama_pegawai'] + ", " + result[i]['jabatan'] +"</option>";
													
										$$('#selectpickerpegawai').append(str);
									}
								});
						}
					}

					$$('#btnsetuju').on('click', function(){
						var ket = $$('#keterangan').val();
						var pegawai = $$('#selectpickerpegawai').val();
						if (us == 'kasie') {
							app.request.post(server + "/ecurhat/updateacckasie.php", {pegawai,status, ket, id}, function(data){
								app.dialog.alert(data);
							});
							var judul = "Pemberitahuan";
							var isi	= "Anda Mendapatkan Pengaduan Baru";
							app.request.post(server + '/ecurhat/notif.php',
								{judul, isi}, function(data){
									$$(document).on('deviceready', function() {
										var notificationOpenedCallback = function(jsonData) {
									    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
									  };

									  window.plugins.OneSignal
									    .startInit("ae0c3b87-ce80-465e-a424-80ebfc9448ab")
									    .handleNotificationOpened(notificationOpenedCallback)
									    .endInit(); 
									    window.plugins.OneSignal.setSubscription(true);
									    window.plugins.OneSignal.enableNotificationWhenActive(true);
									}, false);
								
							});
						}
						else{
							app.request.post(server + "/ecurhat/updatevalacc.php", {us,status, ket, id}, function(data){
								app.dialog.alert(data);
							});
						}

					});

				}
			}
		},
		{
			path: '/viewhistorykeluhan/:idkeluhan',
			url: 'viewhistorykeluhan.html',
			on:{
				pageInit: function(e, page){
					app.panel.disableSwipe();
					var id = page.router.currentRoute.params.idkeluhan;
					tipehal = 'progresskeluhan';
					localStorage.tipehal = tipehal;
					username = localStorage.username;
					kategori = localStorage.kategori;

					app.request.post(server + "/ecurhat/viewkeluhan.php?id="+id, {} , function(data){
						var obj = JSON.parse(data);
						for (var i = 0; i < obj.length; i++) {
							var str = "<input type='hidden' id='idkeluhan' name='idkeluhan' value='"+ id +"'>" +
							  "<div class='card-content card-content-padding'>"+ 
								  "<p> Topik Keluhan: "+ obj[i]['topik_pesan'] +"</p>" +
								  "<p> Isi Keluhan: "+ obj[i]['isi_pesan'] +"</p>" +
							  "</div>";

							$$('#data_keluhan').append(str);
						}
					});
				}
			}
		},
		{
			path: '/historykeluhan/',
			url: 'historykeluhan.html',
			on:{
				pageInit: function(e, page){
					app.panel.disableSwipe();
					username = localStorage.username;
					status = localStorage.kategori;
					tipehal = "historykeluhan";

					app.request.post(server + '/ecurhat/showlistkeluhan.php', {username, status, tipehal} , function(data){
					var obj = JSON.parse(data);
						for (var i = 0; i < obj.length; i++) {
							var str = 
							"<li>" +
			                  "<a href='/viewhistorykeluhan/"+ obj[i]['id_keluhan'] +"' class='item-link item-content'>" +
			                    "<div class='item-inner'>" +
			                      "<div class='item-title-row'>" +
			                        "<div class='item-title'>"+ obj[i]['topik_pesan'] +"</div>" +
			                        "<div class='item-after'>"+ obj[i]['tanggal_diterima'] +"</div>" +
			                      "</div>" +
			                      "<div class='item-text'>" + obj[i]['isi_pesan'] + "</div>"
			                    "</div>" +
			                  "</a>" +
			                "</li>";

			                $$('#datakeluhan').append(str);
						}
					});
				}
			}
		},
		{
			path: '/historykonseling/',
			url: 'historykonseling.html',
			on:{
				pageInit: function(e, page){
					app.panel.disableSwipe();
					username = localStorage.username;
					status = localStorage.kategori;
					tipehal = "historykonseling";
					app.request.post(server + '/ecurhat/showlistkeluhan.php', {username, status, tipehal} , function(data){
					var obj = JSON.parse(data);
						for (var i = 0; i < obj.length; i++) {
							var str = 
							"<li>" +
			                  "<a href='/chathistory/"+ obj[i]['id_keluhan'] +"' class='item-link item-content'>" +
			                    "<div class='item-inner'>" +
			                      "<div class='item-title-row'>" +
			                        "<div class='item-title'>"+ obj[i]['topik_pesan'] +"</div>" +
			                        "<div class='item-after'>"+ obj[i]['tanggal_diterima'] +"</div>" +
			                      "</div>" +
			                      "<div class='item-text'>" + obj[i]['isi_pesan'] + "</div>"
			                    "</div>" +
			                  "</a>" +
			                "</li>";

			                $$('#datakeluhan').append(str);
						}
					});
				}
			}
		},
		{
			path: '/chathistory/:idroom',
			url: 'chathistory.html',
			on:{
				pageInit: function(e, page){
					app.panel.disableSwipe();
					var id = page.router.currentRoute.params.idroom;
					username = localStorage.username;
					status = localStorage.kategori;
					tipehal = 'chat';
					localStorage.tipehal = tipehal;
					// $$("#sendchat").hide();

					app.request.post(server + '/ecurhat/pesanchat.php',{username, status, tipehal, id}, function(data){
						// console.log(data[0]['pegawai_idpegawai']);
						// console.log(data);
						var obj = JSON.parse(data);
						// page.router.refreshPage();
						for (var i = 0; i < obj.length; i++) {
							// var idroom = obj[i]['id_keluhan'];
							var idroom = id;
							var idpegawai = obj[i]['pegawai_idpegawai'];
							var idklien = obj[i]['klien_id_klien'];
							var namaklien = obj[i]['nama_lengkap'];
							var namapegawai = obj[i]['nama_pegawai'];
							
							if (status == 'klien') {
								
								app.request.post(server + '/ecurhat/readchat.php',{status,idpegawai,idroom,idklien},function(data){
									var objct = JSON.parse(data);
									// console.log(data);
									// var sndmsg;
									for (var i = 0; i < objct.length; i++) {
										if(objct[i]['keterangan'] == status){
											var sndmsg = 
												'<div class="message message-sent">' +
											      '<div class="message-content">' +
										        	'<div class="message-name">Blue Ninja</div>' +
										          		'<div class="message-bubble">' +
										            		'<div class="message-text">'+ objct[i]['isi_chat']+' </div>' +
										          		'</div>' +
										        	'</div>' +
										        '</div>';
									        	$$("#chats").append(sndmsg);
										}
										else{
											var sndmsg = 
											'<div class="message message-received">' +
										        '<div class="message-content">' +
										          '<div class="message-name">Blue Ninja</div>' +
										          '<div class="message-bubble">' +
										            '<div class="message-text"> '+ objct[i]['isi_chat'] +' </div>' +
										          '</div>'
										        '</div>'
										      '</div>';
										      $$("#chats").append(sndmsg);
										}
										

									    $$("#namakontak").html(namapegawai);
							   		}
								});
							}
						}
					});
				},
			}
		},
		{
			path: '/listkonselor/',
			url: 'listkonselor.html',
			on:{
				pageInit: function(e, page){
					app.panel.disableSwipe();

					app.request.post(server + '/ecurhat/konselor.php', {}, function(data){
						var obj = JSON.parse(data);
						for (var i = 0; i < obj.length; i++) {
							var str = 
							"<div class='card'> <div class='card-content card-content-padding'>"+ 
								  "<p> Nama lengkap: "+ obj[i]['nama_pegawai'] +"</p>" +
								  "<p> Jenis Kelamin: "+ obj[i]['jenis_kelamin'] +"</p>" +
								  "<p> Tanggal Lahir: "+ obj[i]['tanggal_lahir'] +"</p>" +
								  "<p> Pendidikan Terakhir: "+ obj[i]['pendidikan_terakhir'] +"</p>" +
								  "<p> Jabatan: "+ obj[i]['jabatan'] +"</p>" +
							  "</div></div>";
							$$('#daftarkonselor').append(str);
						}
					});
				},
			}
		},
		{
			path: '/tambahkonselor/',
			url: 'tambahkonselor.html',
			on:{
				pageInit: function(e, page){
					app.panel.disableSwipe();
					$$('#btntambahpegawai').on('click', function(){
						var x = new FormData($$('.tambahkonselor')[0]);


						app.request.post(server + '/ecurhat/registeruser.php', 
						x, function(data){							
							app.dialog.alert('Akun Konselor berhasil terdaftar');
							page.router.navigate('/berandabackend/');
						});
					});
				}
			}
		},
	]
});
if(localStorage.kategori == 'klien'){
	var mainView = app.views.create('.view-main', {
		url: '/beranda/'
	});
}

else if(localStorage.kategori == 'admin' || localStorage.kategori == 'konselor'){
	var mainView = app.views.create('.view-main', {
		url: '/berandabackend/'
	});
}

else if(!localStorage.kategori){
	var mainView = app.views.create('.view-main', {
		url: '/login/'
	});
}

$$(document).on('deviceready', function() {
	var notificationOpenedCallback = function(jsonData) {
    console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
  };

  window.plugins.OneSignal
    .startInit("ae0c3b87-ce80-465e-a424-80ebfc9448ab")
    .handleNotificationOpened(notificationOpenedCallback)
    .endInit(); 
    window.plugins.OneSignal.setSubscription(true);
    window.plugins.OneSignal.enableNotificationWhenActive(true);
}, false);

function readMessage(id, status, page){
  // var page = app.views.main.router.url;
  app.panel.disableSwipe();
	
  
    setTimeout(function () {
    	page.router.refreshPage();
		// username = localStorage.username;
		// tipehal = 'chat';
		// localStorage.tipehal = tipehal;
		// $$("#sendchat").hide();

		// app.request.post(server + '/ecurhat/pesanchat.php',{username, status, tipehal, id}, function(data){
		// 	// console.log(data[0]['pegawai_idpegawai']);
		// 	// console.log(data);
		// 	var obj = JSON.parse(data);
		// 	// page.router.refreshPage();
		// 	for (var i = 0; i < obj.length; i++) {
		// 		// var idroom = obj[i]['id_keluhan'];
		// 		var idroom = id;
		// 		var idpegawai = obj[i]['pegawai_idpegawai'];
		// 		var idklien = obj[i]['klien_id_klien'];
		// 		var namaklien = obj[i]['nama_lengkap'];
		// 		var namapegawai = obj[i]['nama_pegawai'];
				
		// 		if (status == 'klien') {
								
		// 			app.request.post(server + '/ecurhat/readchat.php',{status,idpegawai,idroom,idklien},function(data){
		// 				var objct = JSON.parse(data);
		// 				// console.log(data);
		// 				// var sndmsg;
		// 				for (var i = 0; i < objct.length; i++) {
		// 					var sndmsg1 = 
		// 						'<div class="message message-received">' +
		// 					        '<div class="message-content">' +
		// 					          '<div class="message-name">Blue Ninja</div>' +
		// 					          '<div class="message-bubble">' +
		// 					            '<div class="message-text"> '+ objct[i]['isi_chat'] +' </div>' +
		// 					          '</div>'
		// 					        '</div>'
		// 					      '</div>';
		// 					      $$("#chats").append(sndmsg1);
							

		// 				    $$("#namakontak").html(namapegawai);
		// 		   		}
		// 			});
					
		// 		}

		// 		if (status == 'konselor'){
		// 			app.request.post(server + '/ecurhat/readchat.php',{status,idpegawai,idroom,idklien},function(data){
		// 				var objct = JSON.parse(data);
		// 				// console.log(idpegawai);
		// 				for (var i = 0; i < objct.length; i++) {
		// 					// console.log(objct[i]['keterangan']);
		// 					// console.log(data);
		// 					var sndmsg1 = 
		// 					'<div class="message message-received">' +
		// 				        '<div class="message-content">' +
		// 				          '<div class="message-name">Blue Ninja</div>' +
		// 				          '<div class="message-bubble">' +
		// 				            '<div class="message-text"> '+ objct[i]['isi_chat'] +' </div>' +
		// 				          '</div>'
		// 				        '</div>'
		// 				      '</div>';
		// 				      $$("#chats").append(sndmsg1);
		// 					// console.log(obj);
		// 				    $$("#namakontak").html(namaklien);
		// 			   		// $$("#receivedchat").append(sndmsg);

		// 			   	// 	var msgsndr =
		// 			    //     	'<div class="message-content">' +
		// 			    //     	'<div class="message-name">Blue Ninja</div>' +
		// 			    //       		'<div class="message-bubble">' +
		// 			    //         		'<div class="message-text">'+ objct[i]['chatsender'] +' </div>' +
		// 			    //       		'</div>' +
		// 			    //     	'</div>';

		// 				   // $$("#sendchat").append(msgsndr);
		// 		   		}
		// 			});
					
		// 		}
		// 	}
		// });
	    readMessage(id, status, page);
  	}, 10000);
}