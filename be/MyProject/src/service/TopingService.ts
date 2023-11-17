import { Repository } from "typeorm"
import { Toping } from "../entity/Toping"
import { AppDataSource } from "../data-source"
import { Request, Response } from "express"
const cloudinary = require('cloudinary').v2;
require('dotenv').config()
class ToppingService{
    private readonly TopingRepository: Repository<Toping> = AppDataSource.getRepository(Toping) 
    async find(req: Request, res:Response) {
        try {
        const topping = await this.TopingRepository.find()
            res.status(200).json(topping)
        } catch (error) {
            console.log(error)
        }
    }
    async findOne(req: Request, res:Response) {
        const {id} = req.params
        try {
        const topping = await this.TopingRepository.findOne({
            where: {
                id:Number(id)
            }
        })
            res.status(200).json(topping)
        } catch (error) {
            console.log(error)
        }
    }

    async create(req: Request, res:Response) {
        const {name,price} = req.body
        const filename = res.locals.filename
        console.log('filename',filename)
        try {
        const topping =  this.TopingRepository.create({
            name: name,
            price:price,
            image:filename
        })
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        })
        const uploadCloudenary = await cloudinary.uploader.upload("./upload/" + filename)

        const responCloude = this.TopingRepository.create({
            name: topping.name,
            price: topping.price,
            image: uploadCloudenary.secure_url
        })
        await this.TopingRepository.save(responCloude)
        res.status(200).json(responCloude)
        } catch (error) {
            console.log(error)
        }
    }

    async patch(req: Request, res:Response) {
        const {id} = req.params
        const {name,price,image} = req.body
        try {
        const topping = await this.TopingRepository.findOne({
            where: {
                id:Number(id)
            }
        })
        topping.name = name,
        topping.price = price,
        topping.image = image
        await this.TopingRepository.save(topping)
            res.status(200).json("berhasil di edit")
        } catch (error) {
            console.log(error)
        }
    }

    async delete(req: Request, res:Response) {
        const {id} = req.params
        try {
        const topping = await this.TopingRepository.findOne({
            where: {
                id:Number(id)
            }
        })
        await this .TopingRepository.remove(topping)
            res.status(200).json("Berhasil di hapus")
        } catch (error) {
            console.log(error)
        }
    }
}
export default new ToppingService