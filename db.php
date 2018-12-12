<?php

$tblname= 'omid';

if(isset($_GET["save"]))
    if($_GET["save"]==true){
        DB_SAVE::saveInfo($tblname);
        $_GET["save"]=false;
}
if(isset($_GET["load"]))
    if($_GET["load"]==true){
        DB_LOAD::loadInitial($tblname);
        $_GET["load"]=false;
}

/* <<< DB_SAVE Description >>>
    => this class will grab data from $_POST then if user doesn't exists creates a table for him/her
        (this will be checked by using "show tables like 'username'" statement
    => after checking user existence , if user already has data insert method will update that data
        and if user is new insert will insert data into his table
*/

class DB{
    public static $tablePlayed;
    public static $bigBoard;
    public static $finalBoard;
    public static $turn;
    public static $nextTable;
    public static $player1Time;
    public static $player2Time;

    public static function connect()
    {
        try {
            $conn = new PDO("mysql:host=localhost; dbname=", '', '');
            $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            return $conn;
        } catch (PDOException $e) {
            echo "Error : " . $e->getMessage();
        }
        return false;
    }
    public static function table_exists($conn,$tblname){
        $sql = "show tables like '$tblname'";
        $res=$conn->query($sql);
        if($res->rowCount()>0){
            return true;
        }
        return false;
    }
}

class DB_SAVE extends DB
{
    public static function saveInfo($tblname){

        if(isset($_GET["tp"])&&isset($_GET["bb"])&&isset($_GET["fb"])&&isset($_GET["t"])&&isset($_GET["nt"])&&isset($_GET["p1t"])&&isset($_GET["p2t"])){
            foreach (json_decode($_GET['tp']) as $tp)
                self::$tablePlayed[]=$tp;
            foreach (json_decode($_GET['bb']) as $bb)
                self::$bigBoard[] = (int)$bb;
            foreach (json_decode($_GET['fb']) as $fb)
                self::$finalBoard[] = (int)$fb;
            self::$turn = (int)json_decode($_GET['t']);
            self::$nextTable=(int)json_decode($_GET['nt']);
            self::$player1Time=(int)json_decode(htmlspecialchars($_GET['p1t']));
            self::$player2Time=(int)json_decode(htmlspecialchars($_GET['p2t']));

            $conn=self::connect();
            self::create($conn,$tblname);
            self::insert($conn,$tblname);
        }
    }

    public static function create($conn, $tblname)
    {
        if(!self::table_exists($conn,$tblname))
            $conn->query("create table " . $tblname . "(id int auto_increment primary key ,bigBoard int ,tablePlayed text,finalBoard int,turn int,nextTable int,player1Time int, player2Time int);");
    }

    public static function insert ($conn,  $tblname){

        $sql = "select * from ".$tblname;
        $res=$conn->query($sql);
        if($res->rowCount()>0) {

            $id = 1;
            foreach (self::$bigBoard as $a1) {
                $conn->query("update {$tblname} set bigBoard=$a1 where id=$id");
                $id++;
            }

            $id = 1;
            foreach (self::$finalBoard as $a3) {
                $conn->query("update {$tblname} set finalBoard=$a3 where id=$id");
                $id++;
            }

            $id = 1;
            foreach (self::$tablePlayed as $a2) {
                $conn->query("update $tblname set tablePlayed='$a2' where id=$id");
                $id++;
            }

            $turn = self::$turn;
            $conn->query("update {$tblname} set turn=$turn where id=1");

            $nextTable = self::$nextTable;
            $conn->query("update {$tblname} set nextTable=$nextTable where id=1");

            $player1Time = self::$player1Time;
            $conn->query("update {$tblname} set player1Time=$player1Time where id=1");

            $player2Time = self::$player2Time;
            $conn->query("update {$tblname} set player2Time=$player2Time where id=1");

        }
        else{

            $stmt = $conn->prepare("insert into {$tblname} (bigBoard) value (:bb);");
            foreach (self::$bigBoard as $a1) {
                $stmt->bindParam(':bb', $a1, PDO::PARAM_INT);
                $stmt->execute();
            }

            $id = 1;
            foreach (self::$finalBoard as $a3) {
                $conn->query("update {$tblname} set finalBoard=$a3 where id=$id");
                $id++;
            }

            $id = 1;
            foreach (self::$tablePlayed as $a2) {
                $conn->query("update $tblname set tablePlayed='$a2' where id=$id");
                $id++;
            }

            $turn = self::$turn;
            $conn->query("update {$tblname} set turn=$turn where id=1");

            $nextTable = self::$nextTable;
            $conn->query("update {$tblname} set nextTable=$nextTable where id=1");

            $player1Time = self::$player1Time;
            $conn->query("update {$tblname} set player1Time=$player1Time where id=1");

            $player2Time = self::$player2Time;
            $conn->query("update {$tblname} set player2Time=$player2Time where id=1");
        }
    }

}

class DB_LOAD extends DB
{
    public static function loadInitial($tblname)
    {
        $conn = self::connect();
        if(self::table_exists($conn,$tblname)){
            self::loadData($conn, $tblname);}

    }

    public static function loadData($conn , $tblname)
    {
        $stmt=$conn->query("select bigBoard from $tblname;"); //bigBoard
        while ($row=$stmt->fetch())
            self::$bigBoard[]=(int)$row[0];
        $stmt=$conn->query("select finalBoard from $tblname limit 9;"); //finalBoard
        while ($row=$stmt->fetch())
            self::$finalBoard[]=(int)$row[0];
        $stmt=$conn->query("select tablePlayed from $tblname limit 9;"); //tablePlayed
        while ($row=$stmt->fetch())
            self::$tablePlayed[]=$row[0];
        $stmt=$conn->query("select turn from $tblname where id=1;"); //turn
        self::$turn=$stmt->fetch()[0];
        $stmt=$conn->query("select nextTable from $tblname where id=1;"); //nextTable
        self::$nextTable=$stmt->fetch()[0];
        $stmt=$conn->query("select player1Time from $tblname where id=1;"); //player1Time
        self::$player1Time=$stmt->fetch()[0];
        $stmt=$conn->query("select player2Time from $tblname where id=1;"); //player2Time
        self::$player2Time=$stmt->fetch()[0];
        $arr=array(json_encode(self::$bigBoard),json_encode(self::$finalBoard),json_encode(self::$tablePlayed),self::$turn,self::$nextTable,self::$player1Time,self::$player2Time);
        $arr=json_encode($arr);
        $handle=fopen('Helper/load.json','w');
        fwrite($handle,$arr);
        fclose($handle);

    }
}


