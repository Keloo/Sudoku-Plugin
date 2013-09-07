;(function($, window, document, undefined) {

    var pluginName = "sudokuSolver",
        defaultOptions = {};

    function Plugin(element, options) {
        this.element = $(element);
        this.settings = $.extend({}, defaultOptions, options);
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            this.appendInputs();
        },

        appendInputs: function() {
            for (var i=1; i<=9; i++) {
                for (var j=1; j<=9; j++) {
                    inputElement = $('<input>').attr({
                        type:"text",
                        id: i +''+ j,
                        class: "sudokuInput",
                        maxLength: "1"
                    });
                    if ((i % 3) == 1) {
                        inputElement.css("margin-top", "10px");
                    }
                    if ((j % 3) == 1) {
                        inputElement.css("margin-left", "10px");
                    }
                    inputElement.appendTo(this.element);
                }
                this.element.append('<br />');
            }
        },

        clearInputs: function() {
            this.element.children('input').each(function(){
                this.value = '';
            });
        },

        getInputs: function() {
            var inputs = [];

            for (var i=1; i<=9; i++) {
                inputs[i] = [];
                for (var j=1; j<=9; j++) {
                    inputValue = this.element.find('#'+i+j).val();
                    if (inputValue == '') {
                        inputs[i][j] = 0;
                    } else {
                        inputs[i][j] = parseInt(inputValue);
                    }
                }
            }

            return inputs;
        },

        setInputs: function() {
            for (var i=1; i<=9; i++) {
                for (var j=1; j<=9; j++) {
                    input = this.element.find('#'+i+j);
                    if (this.inputs[i][j]) {
                        input.val(this.inputs[i][j]);
                    } else {
                        input.val('');
                    }
                }
            }
        },

        checkInput: function(val) {
            var cornerX = Math.floor((this.x - 1) / 3)*3 + 1,
                cornerY = Math.floor((this.y - 1) / 3)*3 + 1;

            for (var i=1; i<=9; i++) {
                if ((this.inputs[this.x][i] == val) || (this.inputs[i][this.y] == val)) {
                    return false;
                }
            }
            for (i=cornerX; i<=cornerX+2; i++) {
                for (var j=cornerY; j<=cornerY+2; j++) {
                    if (this.inputs[i][j] == val) {
                        return false;
                    }
                }
            }

            return true;
        },

        goForward: function() {
            do {
                this.y++;
                if (this.y > 9) {
                    this.x++;
                    this.y = 1;
                }
            } while ((this.x <= 9) && (this.inputsOriginal[this.x][this.y] > 0));
        },

        goBackward: function() {
            do {
                this.y--;
                if (this.y < 1) {
                    this.x--;
                    this.y = 9;
                }
            } while(this.inputsOriginal[this.x][this.y] > 0);
        },

        solveInput: function() {
            for (i=this.inputs[this.x][this.y]+1; i<=9; i++) {
                if (this.checkInput(i)) {
                    this.inputs[this.x][this.y] = i;
                    this.goForward();
                    return;
                }
            }
            this.inputs[this.x][this.y] = 0;
            this.goBackward();
        },

        solvePuzzle: function() {
            this.inputs = this.getInputs();
            this.inputsOriginal = this.getInputs();
            this.x = 1;
            this.y = 0;

            this.goForward();
            while ((this.x <= 9) && (this.y <= 9)) {
                this.solveInput();
            }
            this.setInputs();
        },

        generatePuzzle: function(options) {
            var firstValue = Math.round(Math.random()*8+1);

            this.inputs = [];
            for (var i=1; i<=9; i++) {
                this.inputs[i] = [];
                for (var j=1; j<=9; j++){
                    this.inputs[i][j] = 0;
                }
            }
            for (i=1; i<=1000; i++) {
                this.x = Math.round(Math.random()*8+1);
                this.y = Math.round(Math.random()*8+1);
                if (this.checkInput(firstValue)) {
                    this.inputs[this.x][this.y] = firstValue;
                }
            }
            this.setInputs();
            this.solvePuzzle();
            for (i=1; i<=options.level*10; i++) {
                do {
                    this.x = Math.round(Math.random()*8+1);
                    this.y = Math.round(Math.random()*8+1);
                } while (!this.inputs[this.x][this.y]);
                this.inputs[this.x][this.y] = 0;
            }
            this.setInputs();
        }
    }

    $.fn[pluginName] = function(options) {
        return this.each(function(){
            if (!$.data(this, "plugin_" + pluginName))
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
        });
    }

})(jQuery, window, document);
