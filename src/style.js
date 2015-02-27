var _ = require('lodash');

var style = {
    lineHeight: 34,
    lineHeightPX: '34px',
    itemHeight: 32,
    itemHeightPX: '32px',

    gardient: {
        normal: 'linear-gradient(135deg, #6bb6c4 0%,#6b9ad3 100%)',
        backward: 'linear-gradient(-45deg, #6bb6c4 0%,#6b9ad3 100%)',
    },

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
        color: '#96a6ad',
        backgroundColor: '#363c43',
        backgroundImage: 'linear-gradient(to top, rgba(255,255,255,0), rgba(255,255,255,.05))',
        borderRadius: 2,
        border: 'solid 1px rgba(26,29,33,.75)',
        boxShadow: 'inset 0 1px rgba(255,255,255,.02)',
        fontFamily: 'Open Sans',
        fontSize: '13px',
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

(() => {

    var color = '191c1f',
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
  border: 'solid 1px  rgba(93,169,167,1)',
}, style.input);

style.inputDisabled = _.defaults({
  color: '#96a6ad',
  backgroundColor: 'rgba(26,29,33,.6)',
}, style.input);

style.inputError = _.defaults({
    border: 'solid 1px #aa4353',
}, style.input);



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
style.sliderKnob = {
    width: '16px',
    height: '16px',
    borderRadius: '8px',
    backgroundColor: '#262a2e',
    borderStyle: 'solid',
    borderWidth: '2px',
    borderColor: '#96a6ad',
};

style.sliderKnobHover = _.defaults({
	borderColor: '#e2e7eb',
}, style.sliderKnob);

style.sliderKnobActive = _.defaults({
	borderColor: '#6bb6c4',
	backgroundColor: '#6bb6c4',
}, style.sliderKnob);

style.sliderBarBg = {
    width: '268px',
	height: '6px',
	borderRadius: '2px',
	backgroundColor: '#1a1d21',
};

style.sliderBarPropgress = {
    width: '100%',
    margin: 1,
	height: '4px',
	borderRadius: '1px',
	backgroundColor: '#6bb6c4',
};
