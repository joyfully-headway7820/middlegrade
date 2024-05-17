import React from "react";
import dataJson from "../data.json";
import { IDataElement } from "../App";

interface IProps {
	arrDate: string;
	setData: (data: IDataElement[]) => void;
	activeList: boolean;
	setActiveList: (activeList: boolean) => void;
}

export default function SpecList({
	arrDate,
	setData,
	activeList,
	setActiveList,
}: IProps) {
	const [activeSpec, setActiveSpec] = React.useState<string>("Все предметы");
	const arr: string[] = dataJson
		.map((i) => i.spec_name)
		.filter((_, pos) => dataJson[pos].date_visit > arrDate);
	const specList: string[] = arr
		.filter((item: string, pos: number) => arr.indexOf(item) === pos)
		.sort();
	specList.forEach((element) => {
		if (specList.includes(element) && specList.includes(`${element} РПО`)) {
			specList.splice(specList.indexOf(`${element} РПО`), 1);
		}
	});

	return (
		<div>
			<div
				className='activeSpec'
				onClick={(event) => {
					event.stopPropagation();
					setActiveList(!activeList);
				}}
			>
				{activeSpec}
			</div>
			{activeList && (
				<ul>
					<li
						onClick={() => {
							setData(dataJson);
							setActiveSpec("Все предметы");
							setActiveList(false);
						}}
					>
						Все предметы
					</li>
					{specList.map((spec) => (
						<li
							key={spec}
							onClick={() => {
								setData(
									dataJson.filter(
										(element) =>
											element.spec_name === spec ||
											element.spec_name === `${spec} РПО`
									)
								);
								setActiveSpec(spec);
								setActiveList(false);
							}}
						>
							{spec}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
