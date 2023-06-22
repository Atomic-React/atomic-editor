import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

const useDidUpdateEffect = (effectCallback: EffectCallback, deps: DependencyList) => {
	const didMountRef = useRef(false);
  
	useEffect(() => {
		if (didMountRef.current) { 
			return effectCallback();
		}
		didMountRef.current = true;
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, deps);
};

export default useDidUpdateEffect;