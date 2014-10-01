<?php
$tplsNamesArr = array();
$tplsArr = array();
$tplsFullPath = __dir__.'/tpls';
if ($handle = opendir($tplsFullPath)) {
    while (false !== ($entry = readdir($handle))) {
        if ($entry != "." && $entry != "..") {
            $entryPath = $tplsFullPath.'/'.$entry;
            if(is_file($entryPath) && preg_match("/.html/i", $entryPath))
                array_push($tplsNamesArr, strbefore($entry, '.html'));
        }
    }
    closedir($handle);
}

foreach($tplsNamesArr as $tplName){
    $tplPath = $tplsFullPath.'/'.$tplName.'.html';
    if(empty($tplsArr[$tplName])){
        $tplsArr[$tplName] = compileTpl($tplPath);
    }
}

foreach($tplsArr as $tplName=>$tpl){
    if($tplName[0] != '-'){
        file_put_contents(__dir__.'/'.$tplName.'.html', $tpl);
    }
}

function compileTpl($tplPath){
    global $tplsNamesArr, $tplsArr, $tplsFullPath;
    $compiledTpl = '';
    $tpl = file_get_contents($tplPath);
    preg_match_all("~\{\{\s*(.*?)\s*\}\}~", $tpl, $requiredTpls);
    foreach($requiredTpls[1] as $requiredTpl){
        if(!empty($tplsArr[$requiredTpl])){
            $tpl = str_replace('{{'.$requiredTpl.'}}', $tplsArr[$requiredTpl], $tpl);
        }else{
            $tplPath = $tplsFullPath.'/'.$requiredTpl.'.html';
            $tplsArr[$requiredTpl] = compileTpl($tplPath);
            $tpl = str_replace('{{'.$requiredTpl.'}}', $tplsArr[$requiredTpl], $tpl);
        }
    }
    $compiledTpl = $tpl;
    return $compiledTpl;
}

function strbefore($string, $substring) {
  $pos = strpos($string, $substring);
  if ($pos === false)
   return $string;
  else 
   return(substr($string, 0, $pos));
}