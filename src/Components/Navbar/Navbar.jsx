import { CircleUserRound, Search, ShoppingCart } from 'lucide-react'
import { FaHeart } from "react-icons/fa";
import { assets } from '../../../public/assets/asset'

const Navbar = () => {
  return (
    <>
        <div className='fixed w-full top-0 mx-auto py-4 px-10'>
            <div className='flex justify-between items-center px-6'>
                <div className=''>
                    <img src={assets.logo} alt="logo" className='w-[80px]'/>
                </div>

                <div className='flex justify-center items-center gap-20'>
                    <span>
                        <Search strokeWidth={1.5} color='white'/>
                    </span>
                    <span>
                        <ShoppingCart strokeWidth={1.5} color='white'/>
                    </span>
                    <span className='relative'>
                        <CircleUserRound strokeWidth={1.5} color='white'/>
                        <div className='absolute bottom-[-60px] right-2 w-[130px] bg-gray-500 px-1 py-2 rounded-[8px]'>
                            <div className='flex flex-col justify-center items-center'>
                                 <div className='bg-black px-5 py-1 rounded-[8px]'>
                                    <p className='text-white flex justify-center items-center gap-2 text-[14px]'>
                                        <FaHeart className='text-white text-[12px]' /> Wishlist</p>
                                 </div>
                            </div>

                        </div>
                    </span>
                </div>
            </div>
        </div>
    </>
  )
}

export default Navbar