var _ = require('lodash');

var style = {
    lineHeight: '34px',
};

module.exports = style;


style.line = {
  height: style.lineHeight,
  lineHeight: style.lineHeight,
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







style.input = {
  color: '#96a6ad',
  background: 'none',
  fontSize: 'inherit',
  fontFamily: 'inherit',
  padding: '0',
  paddingLeft: '2px',
  borderRadius: '2px',
  height: 32,
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
    height: 32,
    borderRadius: 2,
    backgroundColor: 'rgba(59,66,74,.75)',
    boxShadow: 'inset 0 1px rgba(255,255,255,.02)',
    border: 'solid 1px rgba(26,29,33,.75)',
    backgroundImage: 'linear-gradient(to top, rgba(255,255,255,0), rgba(255,255,255,.05))',
    overflow: 'hidden',
};
