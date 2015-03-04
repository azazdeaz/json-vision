var _ = require('lodash');
var uriBorder = 'data:image/png;base64,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';

var style = {
    lineHeight: 34,
    lineHeightPX: '34px',
    itemHeight: 32,
    itemHeightPX: '32px',

    gardient: {
        normal: 'linear-gradient(135deg, #6bb6c4 0%,#6b9ad3 100%)',
        backward: 'linear-gradient(-45deg, #6bb6c4 0%,#6b9ad3 100%)',
    },

    fontFamily: 'Open Sans',
    fontWeight: '300',

    palette: {
        purple: '#8091c6',
        blue: '#6bb6c4',
        green: '#43aa81',
        red: '#b64d65',
        grey1: '#e2e7eb',
        grey2: '#96a6ad',
        grey3: '#3b424a',
        grey4: '#1a1d21',
    }

};

module.exports = style;


style.line = {
  height: style.lineHeightPX,
  lineHeight: style.lineHeightPX,
  display: 'flex',
  color: '#96a6ad',
  fontSize: '13px',
  backgroundColor: '#262a2e',
  borderBottom: 'solid 1px #1a1d21',
  boxSizing: 'border-box',
};

style.lineGroup = _.defaults({
  color: '#e2e7eb',
  backgroundColor: '#3b424a',
  borderBottom: 'none',
}, style.line);


//Button

style.button = {
    normal: {
        height: style.itemHeight,
        lineHeight: style.itemHeightPX,
        boxSizing: 'border-box',
        color: '#96a6ad',
        borderRadius: 2,
        backgroundColor: '#363c43',
        backgroundImage: 'linear-gradient(to top, rgba(255,255,255,0), rgba(255,255,255,.05))',
        border: 'solid 1px rgba(26,29,33,.75)',
        boxShadow: 'inset 0 1px rgba(255,255,255,.02)',
        fontFamily: 'Open Sans',
        fontSize: '13px',
        margin: '1px 3px',
        padding: '0 8px',
    },
};

style.button.hover = _.defaults({
    color: '#e2e7eb',
    backgroundColor: '#3b424a',
}, style.button.normal);

style.button.active = _.defaults({
    color: '#6bb6c4',
    backgroundColor: '#363c43',
    boxShadow: 'inset 0 -1px rgba(255,255,255,.02)',
    backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0), rgba(0,0,0,.1))',
}, style.button.normal);

style.button.disabled = _.defaults({
    color: 'rgba(150,166,173,.2)',
    backgroundColor: '#2c3136',
    border: 'solid 1px rgba(26,29,33,.32)',
}, style.button.normal);

//colored button
(() => {

    var color = '#191c1f',
        colorDisabled = 'rgba(23,28,31,.7)',
        bg = '#262a2e',
        gardient = 'linear-gradient(135deg, #6bb6c4 0%,#6b9ad3 100%)',
        gardientBW = 'linear-gradient(-45deg, #6bb6c4 0%,#6b9ad3 100%)';

    style.buttonColored = {
        normal: _.defaults({
            color,
            backgroundColor: bg,
            backgroundImage: 'linear-gradient(135deg, rgba(107,182,196,.75) 0%,rgba(107,154,211,.75) 100%)',
        }, style.button.normal),

        hover: _.defaults({
            color,
            backgroundColor: bg,
            backgroundImage: 'linear-gradient(135deg, rgba(107,182,196,1) 0%,rgba(107,154,211,1) 100%)',
        }, style.button.hover),

        active: _.defaults({
            color,
            backgroundColor: bg,
            backgroundImage: 'linear-gradient(-45deg, rgba(107,182,196,.75) 0%,rgba(107,154,211,.75) 100%)',
        }, style.button.active),

        disabled: _.defaults({
            color: colorDisabled,
            backgroundColor: bg,
            backgroundImage: 'linear-gradient(135deg, rgba(107,182,196,.32) 0%,rgba(107,154,211,.32) 100%)',
        }, style.button.disabled),
    };
})();

//empty button
style.buttonEmpty = {
    normal: _.assign({}, style.button.normal, {
        backgroundImage: 'none',
        backgroundColor: 'none',
        border: 'none',
        boxShadow: 'none',
    }),

    hover: _.assign({}, style.button.hover, {
        backgroundImage: 'none',
        backgroundColor: 'none',
        border: 'none',
        boxShadow: 'none',
    }),

    active: _.assign({}, style.button.active, {
        backgroundImage: 'none',
        backgroundColor: 'none',
        border: 'none',
        boxShadow: 'none',
    }),

    disabled: _.assign({}, style.button.disabled, {
        backgroundImage: 'none',
        backgroundColor: 'none',
        border: 'none',
        boxShadow: 'none',
    }),
};






//Input
style.input = {
  color: '#96a6ad',
  background: 'none',
  fontSize: 'inherit',
  fontFamily: 'inherit',
  padding: '0',
  paddingLeft: '2px',
  borderRadius: '2px',
  height: style.itemHeight,
  margin: '1px 3px',
  boxSizing: 'border-box',
  border: 'solid 1px rgba(0,0,0,0)',
  outline: 'none',
};

style.inputHover = _.defaults({
  color: '#e2e7eb',
  border: 'solid 1px rgba(68,79,88,.5)',
}, style.input);

style.inputActive = _.defaults({
  color: '#6bb6c4',
  boxShadow: '0 0 3px rgba(86,83,136,.6), inset 0 0 4px rgba(86,83,136,.6)',
  border: 'solid 1px rgba(93,169,167,1)',
}, style.input);

style.inputDisabled = _.defaults({
  color: '#96a6ad',
  backgroundColor: 'rgba(26,29,33,.6)',
}, style.input);

style.inputError = _.defaults({
    border: 'solid 1px #aa4353',
}, style.input);

//Tooltip
style.tooltip = {
  position: 'fixed',
  fontFamily: style.fontFamily,
  fontWeight: style.fontWeight,
  color: '#6bb6c4',
  borderRadius: 2,
  padding: '5px',
  backgroundColor: '#363c43',
  backgroundImage: 'linear-gradient(to top, rgba(255,255,255,0), rgba(255,255,255,.05))',
  boxSizing: 'border-box',
  boxShadow: '0 0 3px rgba(86,83,136,.6), inset 0 0 4px rgba(86,83,136,.6)',
  border: 'solid 1px rgba(93,169,167,1)',
};


//Dropdown
style.dropdown = {
    height: style.itemHeight,
    lineHeight: style.itemHeightPX,
    borderRadius: 2,
    backgroundColor: 'rgba(59,66,74,.75)',
    boxShadow: 'inset 0 1px rgba(255,255,255,.02)',
    border: 'solid 1px rgba(26,29,33,.75)',
    backgroundImage: 'linear-gradient(to top, rgba(255,255,255,0), rgba(255,255,255,.05))',
    overflow: 'hidden',
    boxSizing: 'border-box',
    margin: '1px 0',
    outline: 'none',
};

style.dropdownHover = _.defaults({
    color: '#e2e7eb',
    backgroundColor: '#3b424a',
}, style.dropdown);

style.dropdownOpen = _.defaults({
    height: 'auto',
    position: 'relative',
    color: '#6bb6c4',
    backgroundColor: '#3b424a',
    backgroundImage: 'linear-gradient(to top, rgba(0,0,0,0), rgba(0,0,0,.1))',
}, style.dropdown);

style.dropdownItem = {
    height: style.itemHeight,
    padding: '0 8px',
};

style.dropdownItemHover = _.defaults({
    backgroundColor: 'rgba(226,231,235,.05)',
}, style.dropdownItem);


//Slider

style.slider = {
    flex: 1,
    position: 'relative',
	height: style.itemHeight,
};

style.sliderHandle = {
    width: 16,
    height: 16,
    top: 8,
    borderRadius: 8,
    position: 'absolute',
    boxSizing: 'border-box',
    backgroundColor: '#262a2e',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderColor: '#96a6ad',
};

style.sliderHandleHover = _.defaults({
	borderColor: '#e2e7eb',
}, style.sliderHandle);

style.sliderHandleActive = _.defaults({
	borderColor: '#6bb6c4',
	backgroundColor: '#6bb6c4',
}, style.sliderHandle);

style.sliderBarBg = {
	margin: '15px 5px',
	height: 6,
	borderRadius: '2px',
	backgroundColor: '#1a1d21',
};

style.sliderBarProgress = {
    // width: '100%',
    margin: 1,
	height: 4,
	borderRadius: '1px',
	backgroundColor: '#6bb6c4',
};
