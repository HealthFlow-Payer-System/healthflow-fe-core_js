import React from 'react';

const toIconName = (input) => {
  let name = input.replace(/Icon$/, '').replace(/Outlined$/, '');
  let snake = name
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/([a-zA-Z])([0-9]+)/g, '$1_$2')
    .toLowerCase()
    .replace(/__+/g, '_');
  return snake;
};

const GetIconComponent = (inputName, options = {}) => {
    const variant = options.variant || 'outlined';
    const className = `material-symbols-${variant}`;
    const transforms = [];
    if (options.rotate !== undefined) transforms.push(`rotate(${options.rotate}deg)`);
    if (options.flip === 'horizontal') transforms.push('scaleX(-1)');
    if (options.flip === 'vertical') transforms.push('scaleY(-1)');
    const transform = transforms.length > 0 ? transforms.join(' ') : undefined;
    const style = {
      fontSize: 'inherit',
      verticalAlign: 'middle',
      ...(transform && { transform }),
      ...options.styleOverrides
    };
  // === Handle null, undefined, or empty values ===
  if (inputName == null || (typeof inputName === 'string' && !inputName.trim())) {
    console.warn('GetIconComponent: Received empty/null input → falling back to Add icon');

    return (props) => <span className={`${className} ${props.className || ''}`} style={style} {...props}>indeterminate_question_box</span>;
  }

  // === Already a component function ===
  if (typeof inputName === 'function') {
    console.log(`GetIconComponent: Received component function → ${inputName.name || 'Anonymous'}`);
    return inputName;
  }

  // === Already a component ===
  if ( React.isValidElement(inputName)) {
    console.log(`GetIconComponent: Received component → ${inputName.displayName || inputName.name || 'Unknown'}`);
    return inputName;   // return as-is (best for performance)
  }

  // === String case ===
  if (typeof inputName === 'string') {
    const iconName = toIconName(inputName);


    return (props) => <span className={`${className} ${props.className || ''}`} style={style} {...props}>{iconName}</span>;
  }

  // Safety fallback
  console.warn('GetIconComponent: Unexpected input type', typeof inputName);
  return (props) => <span className={`${className} ${props.className || ''}`} style={style} {...props}>indeterminate_question_box</span>;
};

export default GetIconComponent;