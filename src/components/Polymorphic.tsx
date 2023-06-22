import { ComponentPropsWithRef, ComponentPropsWithoutRef, ElementType, PropsWithChildren, ReactElement, forwardRef } from 'react';

export type ValidElement<Props = {}> = keyof Pick<HTMLElementTagNameMap, 'a' | 'button'> | ((props: Props) => ReactElement);

type PolymorphicRef<C extends ElementType> =ComponentPropsWithRef<C>['ref'];

type AsProp<C extends ElementType> = {
  as?: C;
};

type PropsToOmit<C extends ElementType, P> = keyof (AsProp<C> & P);

export type PolymorphicComponentProp<C extends ElementType, Props = {}> = PropsWithChildren<Props & AsProp<C>> & Omit<ComponentPropsWithoutRef<C>, PropsToOmit<C, Props>>;

type PolymorphicComponentPropWithRef<C extends ElementType, Props = {}> = PolymorphicComponentProp<C, Props> & { ref?: PolymorphicRef<C> };

type PolyProps<C extends ElementType> = PolymorphicComponentPropWithRef<C, {}>;
// type PolyProps<C extends ElementType> = PropsWithChildren<{} & AsProp<C>> & { ref?: PolymorphicRef<C> };

type PolyComponent = <C extends ElementType = 'p'>(
  props: PolyProps<C>
) => ReactElement | null;

const PolyComponent: PolyComponent = <C extends ElementType = 'p'>({ as, children, ...rest }: PolyProps<C>, ref?: PolymorphicRef<C>) => {
	const Component = as || 'p';

	return (
		<Component
			{ ...rest }
			ref={ ref }
		>
			{ children }
		</Component>
	);
};

// eslint-disable-next-line no-use-before-define
const Polymorphic = forwardRef(PolyComponent) as <C extends ElementType = 'p'>(props: PolyProps<C> & { ref?: PolymorphicRef<C> }) => ReturnType<typeof PolyComponent>;

export default Polymorphic;