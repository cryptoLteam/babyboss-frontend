import { useState } from 'react';

type Props = {
	id: any,
	imgSrc: any
	amount: any,
	owner: any,
	staked: any,
	handleItemClick: any,
	handleItem: (id: any) => void,
};

function NftItem({ id, imgSrc, amount, owner, staked, handleItemClick, handleItem }: Props) {
	const [selected, setSelected] = useState(false);
	const [sel, setSel] = useState('p-1 m-1 hover:bg-gray-300 rounded-t');

	const handleClick = (e:React.MouseEvent<HTMLDivElement>): void => {
		e.preventDefault();

		if (selected === false) {
			setSel('p-1 m-1 rounded-t bg-gray-500');
			setSelected(true)
			handleItemClick(id, true);
		} else if (selected === true ) {
			setSel('p-1 m-1 hover:bg-gray-300 rounded-t ');
			setSelected(false);
			handleItemClick(id, false);			
		}
	}
	

	return (
    <div className={ sel }>
		<div onClick={ handleClick }>
			<div className=' absolute ml-4 mt-4 text-white '>{(staked === false)? 'Unstacked':'Stacked' }</div>
				<img src={ imgSrc } alt=''/>
			<div>
				<div className='float-left lg:ml-4 '> No #{ id } </div>	
				{/* <div className='float-right text-right lg:mr-4 text-green-600 '> 
					{ amount }
				</div>	 */}
				<br/>
				<div className='text-right text-green-600 lg:mr-4'>
					{ owner }
				</div>
			</div>
		</div>
		<div className='lg:mt-3 mx-5 p-2 text-center text-white rounded-full' style={{ backgroundColor: '#ab29bb' }} onClick={() => handleItem(id)}>
			{staked? "Unstake" : "Stake"}
		</div>
	</div>
  )
}

export default NftItem;