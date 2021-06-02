const socket = io();

$(function() {
    var first = true;
    var name = "";

    $("#msg").append("<p>Digite seu nome:</p>");

    $("#btEnviar").click(function() {
        if (first) {
            name = $("#msg").val();
            $("#m").val("");
            socket.emit("msg", "<p>Bem vindo " + name + "</p>");
            socket.emit("newUser", name);
            first = false;
        } else {
            socket.emit("msg", "<p>" + name + " diz: " + $("#msg").val() + "</p>");
            $("#msg").val("");
        }
    });

    socket.on("newUser", (newUser) => {
        $("#colUsers").append(
            '<div class="row valign-wrapper"><div class="col s2"><img src="https://materializecss.com/images/yuna.jpg" alt="" class="circle responsive-img"></div><div class="col s10"><span class="black-text">' +
            newUser +
            "</span></div></div>"
        );
    });

    socket.on("msg", (msg) => {
        $("#msg").append(msg);
    });
});