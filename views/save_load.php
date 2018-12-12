<!doctype html>
<html lang="en">
<head>
    <title>Save</title>
    <style>
        .container{
            background-color: dimgray;
            color: #FFF;
            width: 50em;
            margin: 10em auto auto;
            padding: 1em;
        }
        form ul{
            margin: 0;padding: 0;
        }
        form li, form label{
            display: block;
            margin-bottom: 1em;
            list-style-type: none;
        }
    </style>
</head>
<body>
<div class="container">
<p>Please enter name of the file that you want to save/load :</p>
<form action="" method="post">
    <ul>
        <li>
            <label for="name">Filename</label>
            <input  name="name" id="name" style="width: 100%;height: 2em">
        </li>
        <li>
            <input type="submit" name="submit" value="Save" >
            <input type="submit" name="submit" value="load" >
        </li>
    </ul>

</form>
</div>
</body>
</html>