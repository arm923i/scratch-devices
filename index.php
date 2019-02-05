<form method="POST">
	<input name="url" type="text" value="<?=isset($_REQUEST['url'])?$_REQUEST['url']:'http://xdan.ru/parser/parser/test.html';?>"/><input type="submit" value="Пошел">
</form>
<?php

include 'simple_html_dom.php';

function request($url,$post = 0){
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url ); // отправляем на 
    curl_setopt($ch, CURLOPT_HEADER, 0); // пустые заголовки
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); // возвратить то что вернул сервер
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1); // следовать за редиректами
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);// таймаут4
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_COOKIEJAR, dirname(__FILE__).'/cookie.txt'); // сохранять куки в файл 
    curl_setopt($ch, CURLOPT_COOKIEFILE,  dirname(__FILE__).'/cookie.txt');
    curl_setopt($ch, CURLOPT_POST, $post!==0 ); // использовать данные в post
    if($post)
        curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
    $data = curl_exec($ch);
    curl_close($ch);
    return $data;
}

class parser{
	var $cacheurl = array();
	var $result = array();
	var $_allcount = 10;
	function __construct(){
		if(isset($_POST['url'])){
			$this->parse($_POST['url']);
		}
	}
	function parse($url){
		$url = $this->readUrl($url);
		
		if( !$url or $this->cacheurl[$url] or $this->cacheurl[preg_replace('#/$#','',$url)] )
			return false;
			
		$this->_allcount--;
		
		if( $this->_allcount<=0 )
			return false;
			
		$this->cacheurl[$url] = true;
		$item = array();	
		
		$data = str_get_html(request($url));
		$item['url'] = $url;
		$item['title'] = count($data->find('title'))?$data->find('title',0)->plaintext:'';
		$item['text'] = $data->plaintext;
		$this->result[] = $item;
		
		if(count($data->find('a'))){
			foreach($data->find('a') as $a){
				$this->parse($a->href);
			}
		}
		$data->clear();
		unset($data);
		
	}
	 function printresult(){
        foreach($this->result as $item){
            echo '<h2>'.$item['title'].' - <small>'.$item['url'].'</small></h2>';
            echo '<p style="margin:20px 0px;background:#eee; padding:20px;">'.$item['text'].'</p>';
        };
        exit();
    }
	var $protocol = '';
	var $host = '';
	var $path = '';
	function readUrl($url){
		$urldata = parse_url($url);
		if( isset($urldata['host']) ){
			if($this->host and $this->host!=$urldata['host'])
				return false;
				
			$this->protocol = $urldata['scheme'];
			$this->host = $urldata['host'];
			$this->path = $urldata['path'];
			return $url;
		}
			
		if( preg_match('#^/#',$url) ){
			$this->path = $urldata['path'];
			return $this->protocol.'://'.$this->host.$url;
		}else{
			if(preg_match('#/$#',$this->path))
				return $this->protocol.'://'.$this->host.$this->path.$url;
			else{
				if( strrpos($this->path,'/')!==false ){
					return $this->protocol.'://'.$this->host.substr($this->path,0,strrpos($this->path,'/')+1).$url;
				}else 
					return $this->protocol.'://'.$this->host.'/'.$url;
			}
		}
	}
}
$pr = new Parser();
$pr->printresult();