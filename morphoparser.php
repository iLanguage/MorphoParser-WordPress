<?php
/*
 Plugin Name: MorphoParser WordPress Plug-in
Plugin URI:
Description: WordPress graphical site indexer using MorphoParser technology.
Version: 0.05
Author: iLanguage Lab
Author URI: http://ilanguage.ca
License: Apache 2.0

Based on analys.icio.us: http://clement.beffa.org/labs/projects/analysicious/

Copyright 2013 iLanguage Lab, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
function display_words() {
	global $post;
	$args = array( 'numberposts' => 200, 'offset'=> 0 );
	$myposts = get_posts( $args );
	foreach( $myposts as $post ) :	setup_postdata($post);
	$content = $content . get_the_content();
	endforeach;

	$content = preg_replace("/^(.*?)<body>(.*?)<\/body>(.*?)$/is", "\\2", $content);
	$content = preg_replace("/<script[^>]*?>.*?<\/script>/is", "", $content);
	$content = strip_tags($content);
	$content = html_entity_decode($content);
	$content = preg_replace("/&[^;]*?;/", " ", $content);
	$content = preg_replace("/(,|\"|\.|\?|:|!|;| - )/", " ", $content);
	$content = preg_replace("/\n/", " ", $content);
	$content = preg_replace("/\s\s+/", " ", $content);

	$content = split(" ",$content);
	$words = Array();
	foreach ($content as $word) {
		$word=strtolower($word);
		if (!isset($words["$word"]))
			$words["$word"] = 1;
		else
			$words["$word"]++;
	}
	unset($words[""]);

	//Remove 50 most used words
	$a = split(" ","the of and to a in that it is was i for on you he be with as by at have are this not but had his they from she which or we an there her were one do been all their has would will what if can when so");
	foreach ($a as $banned) unset($words[$banned]);

	//TODO pass $words array to a JavaScript function that will create the SVG in the DOM

	$url = plugins_url();

	echo "<script type='text/javascript' src='$url/MorphoParser-WordPress/js/rendersvg.js'></script>";
	echo "<script type='text/javascript'>renderSVG($words);</script>";

	//Get numbers for rand function
	srand((double)microtime()*1000000);

	$max=max($words);
	$height = '400';
	$width = '800';
	$mainx = '50';
	$mainy = '50';
	$area = $height*$width;
	$font="arial";

	echo "<svg xmlns='http://www.w3.org/2000/svg'
			xmlns:xlink='http://www.w3.org/1999/xlink'>";
	foreach ($words as $word => $value) {
		$xcoord = rand($mainx,$width+$mainx);
		$ycoord = rand($mainy,$height+$mainy);
		$fontsize=round(7+($value/$max) * ($area/2500)) . 'px';
		$color1=rand(0,255);
		$color2=rand(0,255);
		$color3=rand(0,255);
		if (rand(0,1)) $transform=90; else $transform=0;



		/*
		 $bbox = imagettfbbox($fontsize, $transform, $font, $word);
		*/


		$stringsize = strlen($word)*$fontsize;
		echo "<text x=$xcoord y=$ycoord  transform='rotate($transform $xcoord $ycoord)' style='font-size:$fontsize; font-family:$font; fill:rgb($color1,$color2,$color3)'>$word</text>";
	}
	echo "</svg>";

}

//Register and enqueue JavaScript
function wptuts_scripts_basic()
{
	// Register the script for the plugin:
	wp_register_script( 'renderSVG', plugins_url( '/js/rendersvg.js', __FILE__ ) );

	// Enqueue the script:
	wp_enqueue_script( 'renderSVG' );
}
add_action( 'wp_enqueue_scripts', 'wptuts_scripts_basic' );


// Execute when the admin_notices action is called
add_action( 'wp_loaded', 'display_words' );
?>