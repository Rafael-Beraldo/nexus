using Microsoft.AspNetCore.Mvc;
using backend.Models;
using backend.Services;

namespace backend.Controllers
{
    public class ProductDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public string? Category { get; set; }
        public string? ImageUrl { get; set; } 
    }

    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductController(ProductService productService)
        {
            _productService = productService;
        }

        // GET: api/Product
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts()
        {
            var products = await _productService.GetProductsAsync();
            return Ok(products);
        }

        // GET: api/Product/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProductById(string id)
        {
            var product = await _productService.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        // POST: api/Product
        [HttpPost]
        public async Task<IActionResult> CreateProduct([FromForm] ProductDto productDto, IFormFile? image)
    {
        if (image != null)
        {
            // Gera um caminho único para a imagem
            var imagePath = Path.Combine("uploads", $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}");

            // Cria a pasta 'uploads' se ela não existir
            if (!Directory.Exists("uploads"))
            {
                Directory.CreateDirectory("uploads");
            }

            // Salva a imagem no servidor
            using (var stream = new FileStream(imagePath, FileMode.Create))
            {
                await image.CopyToAsync(stream);
            }

            // Define o caminho da imagem no produto
            productDto.ImageUrl = imagePath;
        }

        // Cria uma instância de Product com os dados recebidos
        var product = new Product
        {
            Name = productDto.Name,
            Description = productDto.Description,
            Price = productDto.Price,
            Category = productDto.Category,
            ImageUrl = productDto.ImageUrl
        };

        // Salva o produto no banco de dados
        await _productService.CreateProductAsync(product);

        return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
    }

        // PUT: api/Product/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(string id, [FromForm] ProductDto updatedProduct, IFormFile? image)
        {
            var product = await _productService.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            if (image != null)
            {
                // Processa a imagem
                var imagePath = Path.Combine("uploads", $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}");

                if (!Directory.Exists("uploads"))
                {
                    Directory.CreateDirectory("uploads");
                }

                using (var stream = new FileStream(imagePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                updatedProduct.ImageUrl = imagePath;
            }

            // Atualiza os dados do produto
            product.Name = updatedProduct.Name ?? product.Name;
            product.Description = updatedProduct.Description ?? product.Description;
            product.Price = updatedProduct.Price ?? product.Price;
            product.Category = updatedProduct.Category ?? product.Category;
            product.ImageUrl = updatedProduct.ImageUrl ?? product.ImageUrl;

            await _productService.UpdateProductAsync(id, product);

            return NoContent();
        }

        // DELETE: api/Product/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(string id)
        {
            var product = await _productService.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            await _productService.DeleteProductAsync(id);
            return NoContent();
        }
    }
}
