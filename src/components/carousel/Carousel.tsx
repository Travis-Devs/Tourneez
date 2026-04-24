import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "#/lib/utils";

type CarouselProps<T> = {
	items: T[];
	renderItem: (item: T, index: number) => React.ReactNode;
	className?: string;
};

export function Carousel<T>({
	items,
	renderItem,
	className,
}: CarouselProps<T>) {
	const [index, setIndex] = useState(0);

	if (items.length === 0) return null;

	const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
	const next = () => setIndex((i) => (i + 1) % items.length);

	return (
		<div className={cn("flex items-center gap-3", className)}>
			<button
				type="button"
				onClick={prev}
				className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm transition-colors hover:bg-muted"
				aria-label="Previous"
			>
				<ChevronLeftIcon className="h-5 w-5" />
			</button>

			<div className="flex-1 min-w-0">{renderItem(items[index], index)}</div>

			<button
				type="button"
				onClick={next}
				className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-background shadow-sm transition-colors hover:bg-muted"
				aria-label="Next"
			>
				<ChevronRightIcon className="h-5 w-5" />
			</button>
		</div>
	);
}
