// scene object variables
var renderer, scene, camera

// field variables
var TableWidth = 400, TableHeight = 200;

// paddle variables
var paddleWidth, paddleHeight, paddleDepth, paddleQuality;
var paddle1DirY = 0, paddle2DirY = 0, paddleSpeed = 4;

// Football variables
var Football, paddle1, paddle2;
var MaxSpeedX = 1, MaxSpeedY = 1, MaxSpeed = 2.1;

var can_move = false;
var CameraMode = 0;

var isSpaceDown=false


function setup()
{

	init();

	animate();
}

function animate()
{	
	renderer.render(scene, camera);
	requestAnimationFrame(animate);
	
	pause();
	ballPhysics();
	paddlePhysics();
	cameraPhysics();
	playerPaddleMovement();
	opponentPaddleMovement();
	rotate_daste();
	return_daste();
}

function init()
{

	var WIDTH = 960,
	  HEIGHT = 540;

	var VIEW_ANGLE = 75,
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.1,
	  FAR = 10000;

	var c = document.getElementById("gameCanvas");
	var stats_c = document.createElement("stat");
	document.body.appendChild( stats_c );


	renderer = new THREE.WebGLRenderer();
	camera =
	  new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);

	scene = new THREE.Scene();

	scene.add(camera);

	//This is the Initial Z position, which later will animate and change itself based on camera selection
	camera.rotation.z = (-180) * Math.PI/180;
	camera.position.z = 350;
	
	renderer.setSize(WIDTH, HEIGHT);



	c.appendChild(renderer.domElement);
	

	var planeWidth = TableWidth,
		planeHeight = TableHeight,
		planeQuality = 10;
		
	// create the paddle1's material
	var paddle1Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x1B32C0
		});
	// create the paddle2's material
	var paddle2Material =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xFF4045
		});
	var paddle1MaterialGhost =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x1B32C0,
		  transparent: true,
		  opacity:0
		});
	// create the plane's material	
	var planeMaterial =
	  new THREE.MeshLambertMaterial(
		{

		  map: THREE.ImageUtils.loadTexture('bg/Field.jpg')
		});
	// create the table's material
	var tableMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x47a8ff
		});
	// Outside Table Color
	var groundMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xFFFFFF,
		  map: THREE.ImageUtils.loadTexture('bg/Background.jpg')
		  //Background.jpg
		});
		
	//The rod that holds the player
	var CylinderMaterial =
	  new THREE.MeshPhongMaterial(
		{

		  map: THREE.ImageUtils.loadTexture('bg/stick.jpg')
		});
		
		
		
		
		
	// create the playing surface plane of table
	var plane = new THREE.Mesh(new THREE.PlaneGeometry(planeWidth, planeHeight, planeQuality, planeQuality),  planeMaterial);
	scene.add(plane);	
	plane.receiveShadow = true;	



		var ground = new THREE.Mesh(new THREE.PlaneGeometry(1500,1000, planeQuality, planeQuality),  groundMaterial);
	  
    // set ground to arbitrary z position to best show off shadowing
	ground.position.z = -200;
	ground.rotation.z=(180) * Math.PI/180;
	scene.add(ground);
	
	
	
	
	var table = new THREE.Mesh(	new THREE.CubeGeometry(planeWidth + 15, planeHeight + 15, 20), tableMaterial);
	table.position.z = -11;
	scene.add(table);
	table.receiveShadow = true;	
	
	

	//Tables left Cover
	var table_top = new THREE.Mesh(	new THREE.CubeGeometry(planeWidth + 15, 15, planeWidth * .18), tableMaterial);
	table_top.position.y = planeHeight/2 + 15/2;
	table_top.position.z = planeWidth * .09 - 16;
	scene.add(table_top);
	

	//Table Right Cover
	var table_bottom = new THREE.Mesh(	new THREE.CubeGeometry(planeWidth + 15, 15, planeWidth * .18), tableMaterial);
	table_bottom.position.y = -(planeHeight/2 + 15/2);
	table_bottom.position.z = planeWidth * .09 - 16;
	scene.add(table_bottom);
	
	

	//Opponent sides right side small window
	var table_right__bottom = new THREE.Mesh(	new THREE.CubeGeometry(15, 15 + planeHeight/4 +4, planeWidth * .12), tableMaterial);
	table_right__bottom.position.x = (planeWidth/2 + 15/2);
	table_right__bottom.position.y = -(planeHeight/2 -15  );
	table_right__bottom.position.z = planeWidth * .06 - 16;
	scene.add(table_right__bottom);
	

	//Opponent sides left side small window
	var table_right__top = new THREE.Mesh(	new THREE.CubeGeometry(15, 15 + planeHeight/4 +4, planeWidth * .12), tableMaterial);
	table_right__top.position.x = (planeWidth/2 + 15/2);
	table_right__top.position.y = (planeHeight/2 -15  );
	table_right__top.position.z = planeWidth * .06 - 16;
	scene.add(table_right__top);
	

	//Start from left wall to right, it passes above the goal window
	var table_right__middle = new THREE.Mesh(	new THREE.CubeGeometry(15, 15*2 + planeHeight , planeWidth * .06), tableMaterial);
	table_right__middle.position.x = (planeWidth/2 + 15/2);
	table_right__middle.position.z = planeWidth * .12 - 16/2 + 4;
	scene.add(table_right__middle);
	
	
	
	
	var table_left__bottom = new THREE.Mesh(	new THREE.CubeGeometry(10, 15 + planeHeight/4 , planeWidth * .12), tableMaterial);
	table_left__bottom.position.x = -(planeWidth/2 + 15/2);
	table_left__bottom.position.y = -(planeHeight/2  - 17.5 );
	table_left__bottom.position.z = planeWidth * .06 - 16;
	scene.add(table_left__bottom);
	
	var table_left__top = new THREE.Mesh(	new THREE.CubeGeometry(10, 15 + planeHeight/4 +4, planeWidth * .12), tableMaterial);
	table_left__top.position.x = -(planeWidth/2 + 15/2);
	table_left__top.position.y = (planeHeight/2 - 19.5  );
	table_left__top.position.z = planeWidth * .06 - 16;
	scene.add(table_left__top);
	
	var table_left__middle = new THREE.Mesh(	new THREE.CubeGeometry(10, 15*2 + planeHeight , planeWidth * .06), tableMaterial);
	table_left__middle.position.x = -(planeWidth/2 + 15/2);
	table_left__middle.position.z = planeWidth * .12 - 16/2 + 4;
	scene.add(table_left__middle);
		
	// // set up the sphere vars
	// lower 'segment' and 'ring' values will increase performance
	var radius = 15,
		widthSegments = 6,
		heightSegments = 6;
		
	// // create the sphere's material
	var sphereMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xFFFFFF,
		  emissive: 0xCC0000,
		  map: THREE.ImageUtils.loadTexture('bg/soccer_ball.png')
		});
		
		
		/************* 		Football	********/
		
	// Create a Football with sphere geometry
	Football = new THREE.Mesh(
	  new THREE.SphereGeometry(
		radius,
		widthSegments,
		heightSegments),
	  sphereMaterial);

	// // add the sphere to the scene
	scene.add(Football);
		
	Football.position.x = 0;
	Football.position.y = 0;

	// We Want the Football ot be a bit above the table's ground, keeping in mind of the radius we have set.
	Football.position.z = 15;
	Football.receiveShadow = true;
    Football.castShadow = true;
	
	
	
	daste1 = new THREE.Object3D();
	scene.add(daste1);
	daste2 = new THREE.Object3D();
	scene.add(daste2);
	
	

	
	daste1.rotation.y = 45 * Math.PI * 180;
	/*********		paddle	*********/
	
	
	// // set up the paddle vars
	paddleWidth = 10;
	paddleHeight = 25;
	paddleDepth = 20;
	paddleQuality = 1;
		
	paddle1 = new THREE.Mesh(
	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),
	  paddle1MaterialGhost);

	// // add the sphere to the scene
	scene.add(paddle1);
	

	//paddleDaste is the Middle Body of the Player
	paddle1Daste = new THREE.Mesh(
	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),
	  paddle1Material);

	// // add the sphere to the scene
	daste1.add(paddle1Daste);
	paddle1Daste.receiveShadow = true;
    paddle1Daste.castShadow = true;


	
	paddle2 = new THREE.Mesh(
	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),
	  paddle1MaterialGhost);
	  
	// // add the sphere to the scene
	scene.add(paddle2);
	
	paddle2Daste = new THREE.Mesh(
	  new THREE.CubeGeometry(
		paddleWidth,
		paddleHeight,
		paddleDepth,
		paddleQuality,
		paddleQuality,
		paddleQuality),
	  paddle2Material);
	  
	// // add the sphere to the scene
	daste2.add(paddle2Daste);
	paddle2Daste.receiveShadow = true;
    paddle2Daste.castShadow = true;
	
	// set paddles on each side of the table
	paddle1.position.x = -TableWidth/2 + paddleWidth + 50;
	paddle2.position.x = TableWidth/2 - paddleWidth - 50;
	
	// lift paddles over playing surface
	paddle1.position.z = paddleDepth;
	paddle2.position.z = paddleDepth;
	
	// set paddles on each side of the table
	//Here X represents (How it move moves other end of table or center of table . it represents Y because of Camera Translation)
	daste1.position.x = -TableWidth/2 + paddleWidth + 50;
	daste2.position.x = TableWidth/2 - paddleWidth - 50;
	
	paddle1Daste.position.x = 0;
	paddle2Daste.position.x = 0;
	
	// lift paddles over playing surface
	var cylinderRadius = 2.5;  //THIS IS JUST THE PLANE white rod Radius which is used below

	daste1.position.z = paddleDepth + (cylinderRadius * 2);
	daste2.position.z = paddleDepth + (cylinderRadius * 2);
	
	paddle1Daste.position.z -= (cylinderRadius * 2);
	paddle2Daste.position.z -= (cylinderRadius * 2);
	
	
	// white cylinder
	
	//CylinderGeometry First parameter Takes Starting Radius from left side, 2nd parameter is what is the radius to second end. like a gradient
	//Length of the cod is the third parameter. , the Reason we Set it respective of planeHeight(Length of field) is because the Rod needs to pass the whole field and have extra on both side



	var CylinderGeometry =	new THREE.CylinderGeometry(cylinderRadius, cylinderRadius, planeHeight * 2, planeQuality);
	var cylinder1 = new THREE.Mesh(CylinderGeometry, CylinderMaterial);

	//I Believe we can change the Position of x and y
	cylinder1.position.set(paddle1Daste.position.x, paddle1Daste.position.y, 0 );
	daste1.add(cylinder1);
	
	var cylinder2 = new THREE.Mesh(CylinderGeometry, CylinderMaterial);
	cylinder2.position.set(paddle2Daste.position.x, paddle2Daste.position.y, 0 );
	daste2.add(cylinder2);
	
	
	// head of paddles
	var CylinderGeometry =	new THREE.SphereGeometry(paddleWidth / 1.5, 32, 16, 0, 2* Math.PI, 0, Math.PI);


	var sphere1 = new THREE.Mesh(CylinderGeometry, paddle1Material);

	//Simplify how much the head is to be above ground(Z axis)
	sphere1.position.set(paddle1Daste.position.x, paddle1Daste.position.y, paddleWidth / 1.5 * 2 - (cylinderRadius * 2));
	daste1.add(sphere1);
	
	var sphere2 = new THREE.Mesh(CylinderGeometry, paddle2Material);
	sphere2.position.set(paddle2Daste.position.x, paddle2Daste.position.y, paddleWidth / 1.5 * 2 - (cylinderRadius * 2));
	daste2.add(sphere2);
	
	
	// The Gripper , Radius for starting and ending width, and How long it should be


			var Gripmaterial =
	  new THREE.MeshPhongMaterial(
		{

		  map: THREE.ImageUtils.loadTexture('bg/cama.jpg')
		});

	  			var Gripmaterial2 =
	  new THREE.MeshPhongMaterial(
		{

		  map: THREE.ImageUtils.loadTexture('bg/cama2.jpg')
		});



	var CylinderGeometry =	new THREE.CylinderGeometry(cylinderRadius*5, cylinderRadius*5, planeHeight/3, planeQuality);
	var cylinder1_daste = new THREE.Mesh(CylinderGeometry, Gripmaterial);
	cylinder1_daste.position.set(cylinder1.position.x, (planeHeight + cylinderRadius*5 + 20), cylinder1.position.z);
	daste1.add(cylinder1_daste);
	
	var cylinder2_daste = new THREE.Mesh(CylinderGeometry, Gripmaterial2);
	cylinder2_daste.position.set(cylinder2.position.x, -(planeHeight + cylinderRadius*5 + 20), cylinder2.position.z);
	daste2.add(cylinder2_daste);
	
	

	
	
    cylinder1.castShadow = true;

	cylinder1_daste.castShadow = true;
	sphere1.castShadow = true;
	
	cylinder2.castShadow = true;
	cylinder2_daste.castShadow = true;
	sphere2.castShadow = true;
		

	
	
	/*************		LIGHTS		***************/
		
	
	pointLight2 =
	  new THREE.PointLight(0xFFFFFF);


	pointLight2.position.x = 0;
	pointLight2.position.y = 0;
	pointLight2.position.z = 10000;
	pointLight2.intensity = .1;



    spotLight = new THREE.SpotLight(0xFFFFFF);
    spotLight.position.set(-800, 0, 460);
    spotLight.intensity = 1;
    spotLight.castShadow = true;
    scene.add(spotLight);





    spotLight1 = new THREE.SpotLight(0xFFFFFF);
    spotLight1.position.set(400, 0, 460);
    spotLight1.intensity = 1;
    spotLight1.castShadow = true;
 	scene.add(spotLight1);


 	spotLight2 = new THREE.SpotLight(0xFFFFFF);
    spotLight2.position.set(0, 0, 460);
    spotLight2.intensity = 1;
    spotLight2.castShadow = true;
    spotLight2.target.position.set(100,0,0);
 	spotLight2.target.updateMatrixWorld();
 	scene.add(spotLight2);


	
	// MAGIC SHADOW CREATOR DELUXE EDITION with Lights PackTM DLC
	renderer.shadowMapEnabled = true;	
}




// Handles camera and lighting logic
function cameraPhysics()
{
	
	

	// rotate to face towards the opponent
	switch (CameraMode){
		case 0:
			
		


		camera.rotation.x=0;
		camera.rotation.y=0;
		camera.rotation.z = (-180) * Math.PI/180;

		camera.position.x = 0;
		camera.position.y = 0;
		camera.position.z = 350;




		break;
		case 1:
			// move to behind the player's paddle
		camera.rotation.x=(0) * Math.PI/180;;
		camera.rotation.y=(-70) * Math.PI/180;
		camera.rotation.z = (270) * Math.PI/180;

		camera.position.x = -400;
		camera.position.y = 0;
		camera.position.z = 250;
		break;
		

	}
}




function ballPhysics()
{
	if(can_move){




	if (Football.position.x <= -TableWidth/2 || Football.position.x >= TableWidth/2) // if Football goes off and hit the Wall of the goalside(not goal but sides, which gives reflection)
	{	
		if ((Football.position.y >= -TableHeight/4 + 10) && (Football.position.y <= TableHeight/4 - 10)){ //IF a Goal iss scored. on either Side
				Football.position.x = 0;
				Football.position.y = 0;
				MaxSpeedY = -MaxSpeedY
				MaxSpeedX = -MaxSpeedX;
				document.getElementById('GoalSound').play();

				MaxSpeedX = 1, MaxSpeedY = 1
				

		}else{
			MaxSpeedX = -MaxSpeedX;
			Football.rotation.x = -Football.rotation.x;
			Football.rotation.y = -Football.rotation.y;
		}
	}
	

	// if Football goes off the top side (side of table)
	if (Football.position.y <= -TableHeight/2 + 10 || Football.position.y >= TableHeight/2 - 10)
	{
		MaxSpeedY = -MaxSpeedY;
		Football.rotation.y = -Football.rotation.y;
	}	

		
	
		// update Football position over time
		Football.position.x += MaxSpeedX * MaxSpeed;
		Football.position.y += MaxSpeedY * MaxSpeed;
		
		if(Football.rotation.y < 0)
		Football.rotation.y -= MaxSpeed * 0.075;
		else
		Football.rotation.y += MaxSpeed * 0.075;
		
		if(Football.rotation.x < 0)
		Football.rotation.X -= MaxSpeed * 0.075;
		else
		Football.rotation.X += MaxSpeed * 0.075;
	}
	
}


// Handles CPU paddle movement and logic
function opponentPaddleMovement()
{
	if(can_move){
		// Lerp towards the Football on the y plane
		paddle2DirY = (Football.position.y - paddle2.position.y) * 0.2;
		

		if (Math.abs(paddle2DirY) <= paddleSpeed)
		{	
			paddle2.position.y += paddle2DirY;
			daste2.position.y += paddle2DirY;
		}
		else
		{
			// if paddle is lerping in +ve direction
			if (paddle2DirY > paddleSpeed)
			{
				paddle2.position.y += paddleSpeed;
				daste2.position.y += paddleSpeed;
			}
			// if paddle is lerping in -ve direction
			else if (paddle2DirY < -paddleSpeed)
			{
				paddle2.position.y -= paddleSpeed;
				daste2.position.y -= paddleSpeed;
			}
		}
	}
}


// Handles player's paddle movement
function playerPaddleMovement()
{
	if(can_move){
		// move left
		if (Key.isDown(Key.DOWNARROW) || Key.isDown(Key.LEFTARROW))		
		{
			// if paddle is not touching the side of table
			// we move
			if (paddle1.position.y < TableHeight * 0.45)
			{
				paddle1DirY = paddleSpeed * 0.5;
			}
			// else we don't move
			// to indicate we can't move
			else
			{
				paddle1DirY = 0;
//				paddle1.scale.z += (10 - paddle1.scale.z) * 0.2;
			}
		}	
		// move right
		else if (Key.isDown(Key.UPARROW) || Key.isDown(Key.RIGHTARROW))
		{
			// if paddle is not touching the side of table
			// we move
			if (paddle1.position.y > -TableHeight * 0.45)
			{
				paddle1DirY = -paddleSpeed * 0.5;
			}
			// else we don't move and stretch the paddle
			// to indicate we can't move
			else
			{
				paddle1DirY = 0;

			}
		}
		// else don't move paddle
		else
		{
			// stop the paddle
			paddle1DirY = 0;
		}
		


		paddle1.position.y += paddle1DirY;
		daste1.position.y += paddle1DirY;


	}
}


// Handles paddle collision logic
function paddlePhysics()
{
	// PLAYER PADDLE LOGIC
	
	// if Football is aligned with paddle1 on x plane
	// remember the position is the CENTER of the object
	// we only check between the front and the middle of the paddle (one-way collision)
	// and if Football is aligned with paddle1 on y plane


	//Football.position.y is higher on left side of table, and negative towards rights side of table
	if (Football.position.y <= paddle1.position.y + paddleHeight/2 +30&&  Football.position.y >= paddle1.position.y - paddleHeight/2-30)
	{
	// and if Football is travelling towards player (-ve direction)
		if (MaxSpeedX < 0)
		{
			console.log("scene1")
			if (Football.position.x <= paddle1.position.x + paddleWidth
			&&  Football.position.x >= paddle1.position.x)
			{

				if(isSpaceDown)
				{
					MaxSpeedX=MaxSpeedX*MaxSpeed
					MaxSpeedY=MaxSpeedX*MaxSpeed
				}
				else
				{
					if(MaxSpeedX>0)
					{
						MaxSpeedX=1
					}
					else
					{
						MaxSpeedX=-1
					}

					if(MaxSpeedY>0)
					{
						MaxSpeedY=1
					}
					else
					{
						MaxSpeedY=-1
					}
					
					

				}
			
				MaxSpeedX = -MaxSpeedX;
				Football.rotation.x = -Football.rotation.x;

				document.getElementById('ding').play();
			}
		}

	}
	
	
	// OPPONENT PADDLE LOGIC	
// and if Football is aligned with paddle2 on y plane
	if (Football.position.y <= paddle2.position.y + paddleHeight/2
	&&  Football.position.y >= paddle2.position.y - paddleHeight/2)
	{
		// and if Football is travelling towards opponent (+ve direction)
		if (MaxSpeedX > 0)
		{
			// if Football is aligned with paddle2 on x plane
			// remember the position is the CENTER of the object
			// we only check between the front and the middle of the paddle (one-way collision)
			if (Football.position.x >= paddle2.position.x - paddleWidth
			&&  Football.position.x <= paddle2.position.x)
			{

				if(isSpaceDown)
				{
					MaxSpeedX=MaxSpeedX*MaxSpeed
					MaxSpeedY=MaxSpeedX*MaxSpeed
				}
				else
				{
					if(MaxSpeedX>0)
					{
						MaxSpeedX=1
					}
					else
					{
						MaxSpeedX=-1
					}

					if(MaxSpeedY>0)
					{
						MaxSpeedY=1
					}
					else
					{
						MaxSpeedY=-1
					}
					
					

				}




				MaxSpeedX = -MaxSpeedX;
				Football.rotation.x = -Football.rotation.x;

				document.getElementById('ding').play();
			}
		}
	}
}


function pause(){
	if (Enter_isUp)		
	{
		if (can_move == false){// resume the game
			can_move = true;
			document.getElementById("pause").innerHTML = "";
		}else{// pause the game
			can_move = false;	
			document.getElementById("pause").innerHTML = "PAUSE!";
		}
		Enter_isUp = false;
	}
}


var daste1_rotation = false;
var daste2_rotation = false;
var rotation_right = true;	
var first_run = true;
var charkhesh = 10 * Math.PI/180;

function rotate_daste(){
	isSpaceDown=false
	if(can_move){
		if(first_run){
			daste1_rotation_temp =  daste1.rotation.y;
			daste2_rotation_temp =  daste2.rotation.y;
			first_run = false;
		}
	
		if(Key.isDown(Key.SPACE))
		{
			isSpaceDown=true
			if(rotation_right)
				daste1.rotation.y += -2*charkhesh;
			else
				daste1.rotation.y += 2*charkhesh;
		}else
		
		
		if(daste2_rotation)
		{
			if(rotation_right == false)
				daste2.rotation.y += -charkhesh;
			else
				daste2.rotation.y += charkhesh;
				// (daste2.rotation.y % daste2_rotation_temp) >= (356 * Math.PI/180)
			if((daste2.rotation.y >= (356 * Math.PI/180) + daste2_rotation_temp &&
					 daste2.rotation.y <= (369 * Math.PI/180) + daste2_rotation_temp) || 
				(daste2.rotation.y <= (-356 * Math.PI/180) + daste2_rotation_temp && 
						daste2.rotation.y >= (-369 * Math.PI/180) + daste2_rotation_temp)){
				daste2_rotation = false;
				daste2.rotation.y = daste2_rotation_temp;
			}
		}
	}
}


window.addEventListener('keyup', function( ev ) {


			switch( ev.keyCode ) {
				case 32:// Space

					daste1_rotation = false;
					first_charkhesh = true;
					break;
				case 13:// Enter

					document.getElementById('StartSound').play();

					Enter_isUp = true;
					break;
				case 67:// C

					if(CameraMode == 0)
						CameraMode=1
					else
						CameraMode=0

					break;
			}
		}, false
	);
	
function return_daste(){
	if(can_move){
	//	document.getElementById("pause").innerHTML = (daste1_rotation_temp % daste1.rotation.y % Math.PI*2);
		if(!daste1_rotation && first_charkhesh){
			if(rotation_right)
			daste1.rotation.y += charkhesh;
		else
			daste1.rotation.y += -charkhesh;
			//(daste1.rotation.y % daste1_rotation_temp) >= (356 * Math.PI/180)
			if(Math.abs(daste1_rotation_temp % daste1.rotation.y % Math.PI*2) >= (-20 * Math.PI/180) &&
					 Math.abs(daste1_rotation_temp % daste1.rotation.y % Math.PI*2) <= (20 * Math.PI/180)){
				daste1_rotation = true;
				daste1.rotation.y = daste1_rotation_temp;
			}
		}
	}
}