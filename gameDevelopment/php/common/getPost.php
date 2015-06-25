<?php

function getPost( $name, $default_value = '' )
{
    $value = $default_value;
    if( isset( $_POST[ $name ] ) && $_POST[ $name ] != '' )
    {
        $value = $_POST[ $name ];
    } 
    return $value;    
}
