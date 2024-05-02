import React, { memo, useCallback, useContext, useEffect } from 'react';
import CloseOutlined from '@ant-design/icons/CloseOutlined';
import FileTextOutlined from '@ant-design/icons/FileTextOutlined';

  return wrapCSSVar(
    <FloatButtonGroupProvider value={shape}>
      <div ref={floatButtonGroupRef} className={groupCls} style={style} {...hoverAction}>
        {trigger && ['click', 'hover'].includes(trigger) ? (
          <>
            <CSSMotion visible={open} motionName={`${groupPrefixCls}-wrap`}>
              {({ className: motionClassName }) => (
                <div className={classNames(motionClassName, wrapperCls)}>{children}</div>
              )}
            </CSSMotion>
            <FloatButton
              ref={floatButtonRef}
              type={type}
              shape={shape}
              icon={open ? mergedCloseIcon : icon}
              description={description}
              aria-label={props['aria-label']}
              {...floatButtonProps}
            />
          </>
        ) : (
          children
        )}
      </div>
    </FloatButtonGroupProvider>,
  );
};

export default memo(FloatButtonGroup);