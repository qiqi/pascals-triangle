"use strict"

function binomial(n, k) {  
    if ((typeof n !== 'number') || (typeof k !== 'number'))   
        return false;   
    var coeff = 1;  
    for (var x = n-k+1; x <= n; x++) coeff *= x;  
    for (x = 1; x <= k; x++) coeff /= x;  
    return coeff;  
}

function box_keyup(evt) {
    check_answer($(evt.target));
}

function check_answer(box) {
    if (!box.prop('disabled') && box.val() == box.data('correct')) {
        box.prop('disabled', true);
        check_row(box.parent());
    }
}

function check_row(row) {
    var countdown = row.data('countdown');
    countdown = Number(countdown) - 1;
    if (countdown == 0) {
        var row_n = Number(row.attr('id').substring(3));
        make_row(row_n + 1);
        var completedRow = Math.max(localStorage.completedRow, row_n);
        localStorage.setItem('completedRow', completedRow);
    } else {
        row.data('countdown',  countdown);
    }
}

function make_box(n, k) {
    var correct = binomial(n, k);
    var box = $('<input type="text" data-correct="' + correct + '">');
    if (correct % 2 == 0)
        box.addClass('even');
    $('#row' + n).append(box);
    box.keyup(box_keyup);
    box.change(box_keyup);
    if (localStorage.completedRow >= n || correct == 1) {
        box.val(correct);
        check_answer(box);
    }
}

function make_row(n) {
    $('#main').data('n', n);
    adjust_width();
    var n_box = n + 1;
    var row = '<span id="row' + n + '" data-countdown="' + n_box + '"></span>';
    $('#main').append($('<div>' + row + '</div>'));
    for (var k = 0; k <= n; ++k)
        make_box(n, k);
}

function adjust_width() {
    var n = $('#main').data('n');
    if (n) {
        var width = Math.max(window.innerWidth - 20, 80 * (n + 2));
        $('#main').css('width', width);
    }
}

$(function(){
    if (localStorage.completedRow == null) {
        localStorage.completedRow = 0;
    }
    make_row(0);
    $(window).on('resize', adjust_width);
    $('#reset').click(function () {
        localStorage.completedRow = 0;
        location.reload();
    });
});
